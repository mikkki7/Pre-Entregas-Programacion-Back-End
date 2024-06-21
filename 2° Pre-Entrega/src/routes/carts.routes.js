import { Router } from 'express';
import { CartsManagerMDB } from "../dao/cartManager.mdb.js";

const cartsRouter = Router();

cartsRouter.post("/", (req, res) => {
    try {
        const cart = CartsManagerMDB.createCart();
        res.json({ status: "succes", payload: cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.get("/:cid", (req, res) => {
    try {
        const id = req.params.cid;
        const cart = CartsManagerMDB.getCartById(id);
        res.json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId= req.params.pid;
        const quantity = req.body.quantity ?? 1;
        const cart = CartsManagerMDB.addProductToCart(cartId, productId, quantity);
        res.json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cart.put("/:cid", (req, res) => {
    try {
        const id = req.params.cid;
        const products = req.body.products ?? [];
        const cart = CartsManagerMDB.updateCart(id, products);
        res.json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

cart.put("/:cid/products/:pid", (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity ?? 1;
        const cart = CartsManagerMDB.updateQuantity(cartId, productId, quantity);
        res.json({ status: "success", payload: cart })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

cartsRouter.delete("/:cid", (req, res) => {
    try {
        const id = req.params.cid;
        const cart = CartsManagerMDB.deleteCart(id);
        res.json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

cartsRouter.delete("/:cid/product/:pid", (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId= req.params.pid;
        const cart = CartsManagerMDB.deleteProductFromCart(cartId, productId);
        res.json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default cartsRouter;