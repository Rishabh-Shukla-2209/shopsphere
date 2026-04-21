import express from "express";
import {
  getOneOrder,
  getUserOrders,
  updateOrder,
  addOrder,
} from "../controllers/orderController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router
  .route("/orders")

  .post(asyncHandler(addOrder));

router
  .route("/orders/:id")
  .get(asyncHandler(getOneOrder))
  .put(asyncHandler(updateOrder));

router.get("/orders/:userid", asyncHandler(getUserOrders));

export default router;
