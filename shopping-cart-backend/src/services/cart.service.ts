import CartRepository from "../repositories/cart.repository";
import ProductRepository from "../repositories/product.repository";
import { STATUS_CODES } from "../constants/statusCodes";

class CartService {
  async getCart(userId: number) {
    const cart = await CartRepository.findActiveCart(userId);

    if (!cart) {
      return [];
    }

    return await CartRepository.getCart(cart.id);
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    // Find active cart
    let activeCart = await CartRepository.findActiveCart(userId);

    let cartId: number;

    if (activeCart) {
      cartId = activeCart.id;
    } else {
      cartId = await CartRepository.createCart(userId);
    }

    // Find Product
    const product = await ProductRepository.findProductForCart(productId);

    if (!product) {
      throw {
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Product not found",
      };
    }

    // Validate Stock
    if (quantity > product.stock) {
      throw {
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Insufficient stock",
      };
    }

    // Check existing cart item
    const existingItem = await CartRepository.findCartItem(cartId, productId);

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + quantity;

      if (updatedQuantity > product.stock) {
        throw {
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "Insufficient stock",
        };
      }

      const totalPrice = updatedQuantity * product.price;

      await CartRepository.updateQuantity(
        existingItem.id,
        updatedQuantity,
        totalPrice,
      );
    } else {
      await CartRepository.addCartItem({
        cart_id: cartId,
        product_id: product.id ?? 0,
        quantity: quantity,
        unit_price: product.price,
        total_price: quantity * product.price,
      });
    }

    return;
  }

  async updateQuantity(cartItemId: number, quantity: number) {
    const cartItem = await CartRepository.findCartItemById(cartItemId);

    if (!cartItem) {
      throw {
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Cart item not found",
      };
    }

    if (quantity > cartItem.stock) {
      throw {
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Insufficient stock",
      };
    }

    const totalPrice = quantity * cartItem.unit_price;

    await CartRepository.updateQuantity(cartItemId, quantity, totalPrice);
  }

  async removeItem(cartItemId: number) {
    const cartItem = await CartRepository.findCartItemById(cartItemId);

    if (!cartItem) {
      throw {
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Cart item not found",
      };
    }

    await CartRepository.removeItem(cartItemId);
  }

  async placeOrder(userId: number) {
    const cart = await CartRepository.findActiveCart(userId);

    if (!cart) {
      throw {
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Cart not found",
      };
    }

    const cartItems = await CartRepository.getCart(cart.id);

    if (cartItems.length === 0) {
      throw {
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Cart is empty",
      };
    }

    await CartRepository.reduceStock(cart.id);

    await CartRepository.placeOrder(cart.id);
  }
}

export default new CartService();
