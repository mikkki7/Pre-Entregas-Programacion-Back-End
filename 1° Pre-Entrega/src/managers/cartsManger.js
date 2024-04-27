import fs from 'fs';
import config from '../config/config.js';
import path from 'path';

const cartFilePath = path.join(config.dirname, "../data/cart.json");

const cartsManager = {
    createCart: (req, res) => {
        let carts = JSON.parse(fs.readFileSync(cartFilePath, "UTF-8"));

        try {
            const newCart = {
                id : carts.length + 1,
                products: []
            };
            carts.push(newCart);
            fs.writeFileSync(cartFilePath, JSON.stringify(carts, null));
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ error: "Error al crear el carrito nuevo" });
        }
    },
    getCarts: (req, res) => {
        try {
            let carts = JSON.parse(fs.readFileSync(cartFilePath, "UTF-8"));
            res.json(carts);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los carritos existentes" });
        }
    },
    getCartById: (req, res) => {
        try {
            let cartId = Number(req.params.cid);
            let carts = JSON.parse(fs.readFileSync(cartFilePath, "UTF-8"));

            let cart = carts.find( cart => cart.id === cartId);

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado por su ID" })
            }
            res.json(cart.products);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el carrito por su ID" });
        }
    },
    addProductToCart: (req, res) => {
        try {
            let productId = Number(req.params.pid);
            let quantity = req.body.quantity || 1;
        
            let cartId = Number(req.params.cid);
            let cart = carts.find( cart => cart.id === cartId);
            let carts = JSON.parse(fs.readFileSync(cartFilePath, "UTF-8"));

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            let productInCart = cart.products.find( item => item.product === productId);

            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            fs.writeFileSync(cartFilePath, JSON.stringify(carts, null));
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el producto al carrito" });
        }
    }
};

export default cartsManager;