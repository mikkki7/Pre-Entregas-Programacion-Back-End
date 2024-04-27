import express from 'express';
import cartsManager from "../managers/cartsManger.js";

const cartsRouter = express.Router();

cartsRouter.get("/", cartsManager.getCarts);
cartsRouter.post("/", cartsManager.createCart);
cartsRouter.get("/:cid", cartsManager.getCartById);
cartsRouter.post("/:cid/product/:pid", cartsManager.addProductToCart);

export default cartsRouter;