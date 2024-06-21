import { Server } from "socket.io";
import { ProductManagerMDB } from "./dao/productManager.mdb.js";
import messaggeModel from "./dao/models/messagge.model.js"; 

const initSocket = (httpServer) => {
    const io = new Server(httpServer);

    io.on('connection', client => {
        console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);
        messaggeModel.find().sort({ createdAt: 1 }).then( message => {
            client.emit('chatLog', messages);
        }).catch( error => { 
            console.error(`Error al obtener mensajes anteriores:`, error);
        });

        client.on('newMessage', data => {
            try {
                const newMessage = new messaggeModel({ user: data.user, message: data.message });
                newMessage.save();
                io.emit("messageArrived", newMessage);
            } catch (error) {
                console.error("Error al guardar el nuevo mensaje:", error);
            }
        });

        client.on("new-product", newProduct => {
            try {
                const newProduct = {
                    title: newProduct.title,
                    description: newProduct.description,
                    code: newProduct.code,
                    price: newProduct.price,
                    status: newProduct.status,
                    stock: newProduct.stock,
                    category: newProduct.category,
                    thumbnail: newProduct.thumbnail,
                };

                ProductManagerMDB.addProduct(newProd);
                const updatedList = ProductManagerMDB.getProducts();

                io.emit("products", updatedList);
                io.emit("response", { status: "success", message: "Producto añadido con exito" });
            } catch (error) {
                io.emit("response", { status: "error", messagge: error.message });
            }
        });

        client.on("delete-product", id => {
            try {
                ProductManagerMDB.deleteProduct(id);
                const updatedList = ProductManagerMDB.getProducts();

                io.emit("products", updatedList);
                io.emit("response", { status: "success", message: `El producto con el id ${id} fue eliminado exitosamente` });
            } catch (error) {
                io.emit("response", { status: "error", message: error.message });
            }
        });
    });
    
    return io;
};

export default initSocket;