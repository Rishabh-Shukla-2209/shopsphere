import express from "express";
import {
  getOneProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  addProduct,
} from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/imgUploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(getProducts))
  .post(protect, authorizeRoles("admin"), upload.array('images', 5),asyncHandler(addProduct));
router
  .route("/:id")
  .get(asyncHandler(getOneProduct))
  .put(protect, authorizeRoles("admin"), upload.array('images', 5), asyncHandler(updateProduct))
  .delete(protect, authorizeRoles("admin"), asyncHandler(deleteProduct));

export default router;
