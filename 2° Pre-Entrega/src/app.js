import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import config from './config/config.js';
import initSocket from './sockets.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js'
import usersRouter from './routes/users.routes.js';
import viewsRouter from './routes/realTime.routes.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(`${config.dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${config.dirname}/views`)
app.set("view engine", `handlebars`)

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

app.use("/static", express.static(`${config.dirname}/public`));

const httpServer = app.listen(config.port, async() => {
    await mongoose.connect(config.mongoDB_URI);
    console.log(`App activa en puerto ${config.port}`);
})

const io = initSocket(httpServer);
app.set("io", io);
