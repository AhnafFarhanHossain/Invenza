import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferences: {
      type: Object,
      default: {
        lowStockNotifications: true,
        newOrderNotification: true,
        outOfStockNotification: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
