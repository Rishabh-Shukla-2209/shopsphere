import express from "express";
import { getReviews, addReview } from "../controllers/reviewController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(asyncHandler(getReviews))
  .post(protect, asyncHandler(addReview));

export default router;
