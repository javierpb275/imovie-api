import mongoose from "mongoose";
import validator from "validator";
import IUser, { Role } from "../interfaces/user.interface";
import Review from "./review.model";
import { hashPassword } from "../helpers/authentication.helper";

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
        const mediumRegex: RegExp = new RegExp(
          "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
        );
        if (!value.match(mediumRegex)) {
          throw new Error(
            "Passwords must have at least 6 characters, one lowercase letter, one uppercase letter and one number"
          );
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
  delete userObject.__v;
  delete userObject.password;
  delete userObject.role;
  return userObject;
};

userSchema.pre<IUser>("remove", async function (next) {
  const user: IUser = this;
  await Review.deleteMany({ user: user._id });
  await User.updateMany({ $pull: { followers: { _id: user._id } } });
  await User.updateMany({ $pull: { followees: { _id: user._id } } });
  next();
});

userSchema.pre<IUser>("save", async function (next) {
  const user: IUser = this;
  if (!user.isModified("password")) {
    return next();
  }
  const hash: string = await hashPassword(user.password);
  user.password = hash;
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
