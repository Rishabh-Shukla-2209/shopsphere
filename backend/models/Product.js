import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
        format: String,
        height: Number,
        width: Number,
      },
    ],
    rating: {
      type: Number,
      default: 0, 
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
