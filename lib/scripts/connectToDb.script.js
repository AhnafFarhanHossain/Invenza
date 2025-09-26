import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB: ", process.env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToDb();