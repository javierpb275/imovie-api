import mongoose from "mongoose";
import config from "../config/config";

export const startMongooseConnection = async (): Promise<void> => {
  try {
    const db = await mongoose.connect(config.DB.URI);
    console.log(`Connected to database successfully!`);
  } catch (error) {
    console.log(`ERROR! Unable to connect to database!`);
  }
};
