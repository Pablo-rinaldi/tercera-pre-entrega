const CartModel = require("../models/cart.model.js");

class CartRepository {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error, no se pudo crear el carrito");
    }
  }

  async getCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        console.log("No existe carrito con la id ingresada");
        return null;
      }
      return cart;
    } catch (error) {
      throw new Error("Error, no se pudo recuperar el carrito");
    }
  }

  async addProduct(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCart(cartId);
      const existingProduct = cart.products.find(
        (item) => item.product._id.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      //Vamos a marcar la propiedad "products" como modificada antes de guardar:
      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error, no se pudo agregar al carrito");
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error, no se pudo borrar el producto del carrito");
    }
  }

  async updateCartProducts(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = updatedProducts;

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async actualizarCantidadesEnCarrito(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (item) => item._id.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;

        cart.markModified("products");

        await cart.save();
        return cart;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      throw new Error("Error al actualizar las cantidades");
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      return cart;
    } catch (error) {
      throw new Error("Error, no pudo vaciarse el carrito");
    }
  }
}

module.exports = CartRepository;
