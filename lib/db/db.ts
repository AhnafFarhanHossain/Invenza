import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI! || "mongodb://localhost:27017/invenza";
if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in .env.local");

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {}).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
