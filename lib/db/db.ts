import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/invenza";

export const dbConnect = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to Database");
};
