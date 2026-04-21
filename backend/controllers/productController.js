import Product from "../models/Product.js";
import { StatusCodes } from "../utils/statusCodes.js";
import { uploadImages } from "../utils/uploadImages.js";
import { formatMultipleImages } from "../utils/formatImage.js";

export const getOneProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Product not found");
  }

  res.json(product);
};

export const getProducts = async (req, res) => {
  const search = req.query.search || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sortBy = req.params.sortBy || "reviews";

  const query = { name: { $regex: search, $options: "i" } };

  const totalProducts = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    page,
    limit,
    totalPages: Math.ceil(totalProducts / limit),
    products,
  });
};

export const addProduct = async (req, res) => {
  const { name, price, stock, description } = req.body;

  if (!name || !price || !stock || !description) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Incomplete Information, Fill all details");
  }

  const files = req.files || [];

  const cloudinaryResults = await uploadImages(files);
  const formatted = formatMultipleImages(cloudinaryResults);

  const product = await Product.create({
    name,
    price,
    stock,
    description,
    images: formatted,
  });

  res.json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Product not found");
  }

  const { name, price, stock, description } = req.body;

  if (!name || !price || !stock || !description) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Incomplete Information, Fill all details");
  }

  const files = req.files || [];
  const cloudinaryResults = await uploadImages(files);
  const formatted = formatMultipleImages(cloudinaryResults);

  const updatedProduct = {
    name,
    price,
    stock,
    description,
    images: formatted.length === 0 ? product.images : formatted,
  };

  await Product.findByIdAndUpdate(product._id, updatedProduct);
  res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Product not found");
  }

  await Product.findByIdAndDelete(product._id);
  res.json({ message: "Product Deleted Successfully" });
};
