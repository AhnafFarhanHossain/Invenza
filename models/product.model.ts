import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    quantity: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    sellPrice: { type: Number, default: 0 },
    unit: { type: String, default: "pcs" },
    image: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user id from token
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
