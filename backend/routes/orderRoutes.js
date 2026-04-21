import express from "express";
import {
  getOneOrder,
  getUserOrders, 
  updateOrder,
  addOrder,
} from "../controllers/orderController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.route('/')
  .get(asyncHandler(getUserOrders))
  .post(asyncHandler(addOrder));

router.route('/:id')
  .get(asyncHandler(getOneOrder))
  .put(asyncHandler(updateOrder));

export default router;
