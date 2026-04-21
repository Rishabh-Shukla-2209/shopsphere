import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: { type: Number, default: 1, required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", cartSchema);
