import express from "express";
import { updateReview, deleteReview } from "../controllers/reviewController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .put(protect, asyncHandler(updateReview))
  .delete(protect, asyncHandler(deleteReview));

export default router;
