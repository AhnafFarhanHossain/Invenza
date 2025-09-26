import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI environment variable");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;
if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("Connected to MongoDB: ", MONGODB_URI);
        return mongoose;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        throw error;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}
