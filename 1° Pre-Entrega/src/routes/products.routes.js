import express from 'express';
import productsManager from "../managers/productsManager.js";

const productsRouter = express.Router();

productsRouter.get("/", productsManager.getProducts);
productsRouter.get("/:pid", productsManager.getProductById);
productsRouter.post("/", productsManager.addProduct);
productsRouter.put("/:pid", productsManager.updateProduct);
productsRouter.delete("/:pid", productsManager.deleteProduct);

export default productsRouter;