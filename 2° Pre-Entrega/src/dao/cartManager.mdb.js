import cartModel from "./models/cart.model.js"
import { ProductManagerMDB } from "./productManager.mdb.js";

export class CartsManagerMDB {
    constructor() {

    };

    createCart(){
        try {
            const cart = cartModel.create({});

            if (!cart) {
                throw new Error("No pudo crearse el carrito nuevo");
            }

            return cart;
        } catch (error) {
            throw error;
        }
    }

    getCartById(id){
        try {
            if (id.length !== 24) {
                throw new Error("El id debe tener 24 caracteres")
            }

            const cart = cartModel.findOne({_id: id }).lean();

            if (!cart) {
                throw new Error(`No se encontro el carrito con el id ${id}`);
            }

            return cart;
        } catch (error) {
            throw error;
        }
    }

    addProductToCart(cartId, productId){
        try {
            ProductManagerMDB.getProductById(productId);

            let cart = this.getCartById(cartId);
            const productIndex = cart.products.findIndex(product => product.productId_id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ productId: productId, quantity: 1 });
            }

            cart = cartModel.findByIdAndUpdate(cartId, { products: cart.products }, { new: true });

            return cart;
        } catch (error) {
            throw error;
        }
    }

    updateProductQuantity(cartId, productId, quantity){
        try {
            let cart = this.getCartById(cartId);
            const productIndex = cart.products.findIndex(product => product.productId.id.toString() === productId);

            if (productIndex === -1) {
                throw new Error(`No se encontro el producto con el id ${productId} en el carrito ${cartId}`);
            } else {
                cart.products[productIndex].quantity = quantity;
            }

            cartModel.updateOne({ _id: cartId }, { products: cart.products });
            cart = this.getCartById(cartId);

            return cart;
        } catch (error) {
            throw error;
        }
    }

    removeProductFromCart(cartId, productId){
        try {
            let cart = this.getCartById(cartId);
            const productIndex = cart.products.findIndex(product => product.productId.id.toString() === productId);

            if (productIndex === -1) {
                throw new Error(`No se encontro el producto con el id ${productId} en el carrito ${cartId}`);
            } else {
                cart.products.splice(productIndex, 1);
            }
            cartModel.updateOne({ _id: cartId }, { products: cart.products });
            cart = this.getCartById(cartId);

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateCart(id, product){
        try {
            const promises = products.map(product => {
                return ProductManagerMDB.getProductById(product.product)
                .catch(error => {
                    throw error;
                });
            });

            await Promise.all(promises);

            let cart = await this.getCartById(id);
            products.forEach(product => {
                const productIndex = cart.products.findIndex(cartProduct => cartProduct.productId && cartProduct.productId._id && cartProduct.productId._id.toString() === product. productId);

                if (productIndex !== -1) {
                    cart.products[productIndex].quantity = product.quantity;
                } else {
                    cart.products.push({ product: product.productId, quantity: product.quantity });
                }
            });
            await cartModel.updateOne({ _id: id }, { products: cart.products });
            cart = await this.getCartById(id);

            return cart;
        } catch (error) {
            throw error;
        }
    }

    deleteCart(id){
        try {
            let cart = this.getCartById(id);
            cartModel.updateOne({ _id: id }, { products: [] });
            cart = this.getCartById(id);

            return cart;
        } catch (error) {
            throw error;
        }
    }
}