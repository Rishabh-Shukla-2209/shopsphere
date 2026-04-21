import Order from "../models/Order.js";
import { StatusCodes } from "../utils/statusCodes.js";

export const getOneOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("order not found");
  }

  if (order.userId.toString() !== req.user.id.toString()) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Unauthorized");
  }

  res.json(order);
};

export const getUserOrders = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search?.trim().toLowerCase() || "";
  const lastSeen = req.query.lastSeen;

  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const query = {
    userId: req.user.id,
  };

  if (search) {
    query.productNames = { $regex: escapedSearch, $options: 'i' };
  }

  if (lastSeen) {
    query.createdAt = { $lt: new Date(lastSeen) };
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1); // fetch one extra to check if there's more

  const hasMore = orders.length > limit;

  if (hasMore) {
    orders.pop(); // remove the extra
  }

  res.json({
    orders,
    hasMore,
    nextPageCursor: hasMore ? orders[orders.length - 1].createdAt : null
  });
};


export const addOrder = async (req, res) => {
  const { orderDetail } = req.body;

  const items = orderDetail.items.map((item) => ({
    product: {
      _id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    },
    quantity: item.quantity,
    totalPrice: item.quantity * item.price,
  }));

  const productNames = items.map(item => item.product.name.toLowerCase());

  const order = await Order.create({
    userId: req.user.id,
    items,
    productNames,
    price: items.reduce((sum, item) => sum + item.totalPrice, 0),
    address: orderDetail.address,
  });

  res.json(order);
};

export const updateOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("order not found");
  }

  if (order.userId.toString() !== req.user.id.toString()) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Unauthorized");
  }

  order.status = 'Cancelled';

  await order.save();

  res.json({message: 'Order cancelled successfully'});
};
