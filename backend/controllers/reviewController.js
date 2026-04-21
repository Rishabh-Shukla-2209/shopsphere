import Product from "../models/Product.js";
import Review from "../models/Review.js";
import { formatMultipleImages } from "../utils/formatImage.js";
import { StatusCodes } from "../utils/statusCodes.js";
import { uploadImages } from "../utils/uploadImages.js";

export const getReviews = async (req, res) => {
  const limit = 10;
  const lastSeen = req.query.lastSeen; // timestamp of last item in previous page

  const query = {
    product: req.query.id,
  };

  if (lastSeen) {
    query.createdAt = { $lt: new Date(lastSeen) };
  }

  const reviews = await Review.find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1); // fetch one extra to check if there's more

  const hasMore = reviews.length > limit;

  if (hasMore) {
    reviews.pop(); // remove the extra
  }

  res.json({
    reviews,
    hasMore,
    nextPageCursor: hasMore ? reviews[reviews.length - 1].createdAt : null,
  });
};

export const addReview = async (req, res) => {
  const { rating, title = "", content = "" } = req.body;
  const files = req.files || [];

  if (!rating) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Rating is required");
  }

  // Optional: check for existing review by this user
  const existingReview = await Review.findOne({
    product: req.params.id,
    user: req.user.id,
  });

  if (existingReview) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("You have already reviewed this product");
  }

  const cloudinaryResults = await uploadImages(files);
  const formatted = formatMultipleImages(cloudinaryResults);

  const review = await Review.create({
    rating,
    title,
    content,
    images: formatted,
    product: req.params.id,
    user: req.user.id,
  });

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Product not found");
  }

  product.numReviews += 1;
  product.rating =
    (product.rating * (product.numReviews - 1) + rating) / product.numReviews;

  await product.save();

  res.status(StatusCodes.CREATED).json(review);
};


export const updateReview = async (req, res) => {
  const existingReview = await Review.findById(req.params.id);

  if (!existingReview) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Review doesn't exist");
  }

  if ((existingReview.user.toString() !== req.user.id.toString())) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("unauthorized");
  }

  const { rating, title = "", content = "" } = req.body;
  const files = req.files || [];

  if (!rating) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Rating is required");
  }

  const cloudinaryResults = await uploadImages(files);
  const formatted = formatMultipleImages(cloudinaryResults);

  // Update fields
  existingReview.rating = rating;
  existingReview.title = title;
  existingReview.content = content;
  existingReview.images =
    formatted.length === 0 ? existingReview.images : formatted;

  // Save updated review
  const updatedReview = await existingReview.save();

  // Update product rating accordingly
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Product not found");
  }

  // Recalculate product rating:
  // (current total rating - old review rating + new review rating) / total reviews
  product.rating =
    (product.rating * product.numReviews - existingReview.rating + rating) /
    product.numReviews;

  await product.save();

  res.status(StatusCodes.OK).json(updatedReview);
};

export const deleteReview = async (req, res) => {
  const existingReview = await Review.findById(req.params.id);

  if (!existingReview) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Review doesn't exist");
  }

  if ((existingReview.user.toString() !== req.user.id.toString())) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("unauthorized");
  }

  const product = await Product.findById(existingReview.product);
  if (!product) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Product not found");
  }

  if(product.numReviews <= 1){
    product.rating = 0;
    product.numReviews = 0;
  }else{
    product.rating =
    (product.rating * product.numReviews - existingReview.rating) /
    (product.numReviews-1);

    product.numReviews -= 1;
  }

  await product.save();

  await Review.findByIdAndDelete(existingReview._id);

  res.json({message: "Review deleted successfully"});
};
