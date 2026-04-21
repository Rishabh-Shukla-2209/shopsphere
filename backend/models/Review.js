import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  title: {
    type: String
  },

  content: {
    type: String
  },

  images: [{
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    format: String,
    height: Number,
    width: Number
  }],

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Review', reviewSchema);
