import mongoose from "mongoose";
import validator from "validator";
import IUser, { Role } from "../interfaces/user.interface";
import Review from "./review.model";
import Vote from "./vote.model";

const userSchema = new mongoose.Schema<IUser>(
  {
    role: {
      type: String,
      enum: Role,
      default: Role.USER,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      validate(value: string) {
        const strongRegex: RegExp = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
        );
        if (!value.match(strongRegex)) {
          throw new Error("Password is not secure");
        }
      },
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    favoriteReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    followees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("createdReviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "user",
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.role;
  return userObject;
};

userSchema.pre<IUser>("remove", async function (next) {
  const user: IUser = this;
  await Review.deleteMany({ user: user._id });
  await Vote.deleteMany({ user: user._id });
  await User.updateMany({ $pull: { followers: { _id: user._id } } });
  await User.updateMany({ $pull: { followees: { _id: user._id } } });
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
