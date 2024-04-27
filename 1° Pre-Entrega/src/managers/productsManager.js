import fs from 'fs';
import config from  "../config/config.js"
import path from 'path';

let productsFilePath = path.join(config.dirname, "../data/products.json");

const productsManager = {
    addProduct: (req, res) => {
        try {
            const products = JSON.parse(fs.readFileSync(productsFilePath, "UTF-8"));
            const newProduct = {
                id: products.length + 1,
                title: req.body.title,
                description: req.body.description,
                code: req.body.code,
                price: req.body.price,
                status: true,
                stock: req.body.stock,
                category: req.body.category,
                thumnails: req.body.thumbnails || []
            };

            products.push(newProduct);
            fs.writeFileSync(productsFilePath, JSON.stringify(products, null));
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el producto" })
        }
    },

    getProducts: (req, res) => {
        try {
            let products = JSON.parse(fs.readFileSync(productsFilePath, "UTF-8"));
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los productos solicitados" })
        }
    },

    getProductById: (req, res) => {
        try {
            let productId = Number(req.params.pid);

            let products = JSON.parse(fs.readFileSync(productsFilePath, "UTF-8"));

            let product = products.find(product => product.id === productId);

            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            } 
            res.json(product);
        } catch (error) {
                res.status(500).json({ error: "Error al obtener el producto por ID" })
            }
    },

    updateProduct: (req, res) => {
        try {
            let productId = Number(req.params.pid);

            let updatedFields = req.body;

            let products = JSON.parse(fs.readFileSync(productsFilePath, "UTF-8"));

            let index = products.findIndex( product => product.id === productId);

            if (index === -1) {
                return res.status(404).json({ error: "Producto no encontrado" })
            }

            products[index] = { ...products[index], ...updatedFields };
            fs.writeFileSync(productsFilePath, JSON.stringify(products, null));
            res.json(products[index]);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el producto" });
        }
    },

    deleteProduct: (req, res) => {
        try {
            let productId = Number(req.params.pid);

            let products = JSON.parse(fs.readFileSync(productsFilePath, "UTF-8"));

            let filteredProducts = products.filter( product => product.id !== productId);

            if (filteredProducts.length === products.length) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            fs.writeFileSync(productsFilePath, JSON.stringify(filteredProducts, null));
            res.json({ message: "Producto eliminado con exito" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el producto" });
        }
    }
};

export default productsManager;