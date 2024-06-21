import { Router } from "express";
import { ProductManagerMDB } from "../dao/productManager.mdb.js";
import productModel from "../dao/models/product.model.js";
import cartModel from "../dao/models/cart.model.js"
import messageModel from "../dao/models/messagge.model.js";

const viewsRouter = Router();

viewsRouter.get("/products", (req, res) => {
    try {
        const products = ProductManagerMDB.getProducts(req);
        res.render("products", {
            products: products,
            style: "products.css"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

viewsRouter.get("/realtimeproducts", (req, res) => {
    try {
        let products = ProductManagerMDB.getProducts();
        res.render("realTimeProducts", { title: "Productos en tiempo real", products : products });
    } catch (error) {
        console.error("Error al obtener los productos en tiempo real:", error);
        res.status(500).send("Error en el servidor")
    }
});

viewsRouter.post("/realtimeproducts", (req, res) => {
    try {
        const newProduct =  req.body;
        ProductManagerMDB.addProduct(newProduct);

        const updatedProducts = ProductManagerMDB.getProducts();

        res.status(200).json({ status: "success", message: "Producto añadido exitosamente" })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

viewsRouter.get("/api/products", (req, res) => {
    try {
        const products = productModel.find().lean();
        res.render("realTimeProducts", { products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

viewsRouter.get("/carts/cid", (req, res) => {
    const id =  req.params.cid;
    
    try {
        const cart = cartModel.findOne({ _id: id }).lean();
        cart.products = cart.products.map(product => {
            return {
                ...product,
                subtotal: product.productId.price * product.quantity
            };
        });

        cart.total = cart.products.reduce((acc, product) => acc + product.subtotal, 0).toFixed(2);
        res.render("carts", {
            style: "carts.css",
            cart
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

viewsRouter.get("/chat", (req, res) => {
    res.render("chat", {});
});

viewsRouter.get("/messages", (req, res) => {
    try {
        const messages = messageModel.find().sort({ createdAr: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Fallo en recuperar los mensajes" });
    }
});

viewsRouter.post("/messages", (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = new messageModel({ user, message });
        newMessage.save();
        
        res.status(201).json(newMessage);
        
        req.app.get("socketServer").emit("newArrived", newMessage);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el mensaje" });
    }
});

export default viewsRouter;