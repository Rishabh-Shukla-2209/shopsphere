import Cart from '../models/Cart.js'
import { StatusCodes } from '../utils/statusCodes.js';

export const getCartItems = async (req, res) => {
    let cart = await Cart.findOne({ userId: req.user._id });

    if(!cart){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error('cart not found');
    }

    res.json(cart);
}

export const addToCart = async (req, res) => {
    const cart = await Cart.findOne({userId: req.user._id});

    if(!cart){
        cart = await Cart.create({userId: req.user._id});
    }

    const itemDetail = {
        product: req.body.product,
        quantity: req.body.quantity ? req.body.quantity : 1
    }

    cart.items.push(itemDetail);
    const updatedCart = await cart.save();

    res.json(updatedCart);

}

export const updateCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Cart not found');
  }

  const productId = req.body.product;
  const newQuantity = req.body.quantity;

  for (let i = 0; i < cart.items.length; i++) {
    const item = cart.items[i];

    if (item.product.equals(productId)) {
      if (newQuantity === 0) {
        cart.items.splice(i, 1);
      } else {
        cart.items[i].quantity = newQuantity; 
      }
      break;
    }
  }

  const updatedCart = await cart.save();
  res.json(updatedCart);
};


export const clearCart = async (req, res) => {
    const cart = await Cart.findOne({userId: req.user._id});

    if(!cart){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error('cart not found');
    }

    await Cart.findByIdAndDelete(cart._id);

    res.json({message: 'Cart cleared successfully'});

}
