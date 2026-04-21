import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          image: { type: String }, // optional, for display
        },
        quantity: { type: Number, default: 1 },
        totalPrice: { type: Number, required: true }, // price * quantity
      },
    ],
    productNames: {
      type: [String],
      index: true,
    },

    status: {
      type: String,
      enum: [
        "Ordered",
        "Packed",
        "Shipped",
        "In Transit",
        "Out for delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Ordered",
    },

    price: {
      type: Number,
      required: true,
    },

    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      contact: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
