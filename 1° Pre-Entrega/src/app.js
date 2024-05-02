import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartsRouter from "./routes/carts.routes.js"
import config from './config/config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.use("/static", express.static(`${config.dirname}/public`));

app.listen(config.port, () => {
    console.log(`App activa en puerto ${config.port}`);
})