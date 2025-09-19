import mongoose from "mongoose";

export interface IBusiness extends Document {
  businessName: string;
  address?: string;
  phone?: string;
  email?: string;
  currency: string;
  weightUnit: string;
  lowStockThreshold: number;
  createdBy: mongoose.Schema.Types.ObjectId; // Link to user
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "INR", "BDT"], // Add more as needed
    },
    weightUnit: {
      type: String,
      default: "kg",
      enum: ["kg", "lbs", "units", "pcs"],
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate business entries for the same user
BusinessSchema.index({ createdBy: 1 }, { unique: true });

export default mongoose.models.Business ||
  mongoose.model<IBusiness>("Business", BusinessSchema);
