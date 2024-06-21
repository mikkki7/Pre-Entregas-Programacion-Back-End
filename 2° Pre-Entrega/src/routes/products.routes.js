import { Router } from 'express';
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import config from "../config/config.js";
import { uploader } from "../upload/uploader.js";
import { ProductManagerMDB } from "../dao/productManager.mdb.js";


const productsRouter = Router();

productsRouter.get("/", (req, res) => {
    try {
        const products = ProductManagerMDB.getProducts(req);
        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productsRouter.get("/:id", (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ error: "Formato de ID invalido" });
        }

        const product = ProductManagerMDB.getProductById(id);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ error: "Producto solicitado no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

productsRouter.post("/", uploader.array("thumbnails, 4"), (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).json({ error: "Todos los campos requeridos deben estar presente" });
    }

    const thumbnails = req.files ? req.files.map(file => file.filename) : [];
    try {
        const newProduct = {
            title,
            description,
            price,
            code,
            stock,
            category,
            thumbnails: thumbnails || []
        };

        const addedProduct = ProductManagerMDB.addProduct(newProduct);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productsRouter.put("/:pid", (req, res) => {
    try {
        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Formato de ID invalido" });
        }

        const updatedProduct = req.body;
        const result = ProductManagerMDB.updateProduct(productId, updatedProduct);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: "Producto solicitado no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productsRouter.delete("/:pid", (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El ID del producto no es valido" });
        }
        
        const process = ProductManagerMDB.deleteProduct(id);
        if (!process) {
            return res.status(404).json({ error: "Producto solicitado no encontrado" });
        }
        res.status(200).send({ origin: config.server, payload: process });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default productsRouter;