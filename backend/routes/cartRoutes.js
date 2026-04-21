import express from "express";
import {
  getCartItems,
  addToCart,
  updateCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.route('/')
  .get(protect, asyncHandler(getCartItems))
  .post(protect, asyncHandler(addToCart))
  .put(protect, asyncHandler(updateCart))
  .delete(protect, asyncHandler(clearCart));


export default router;
