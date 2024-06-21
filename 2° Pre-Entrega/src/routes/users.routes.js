import { Router } from "module";
import mongoose from 'mongoose';
import userModel from "../dao/models/user.model.js";

const userRouter = Router();

userRouter.get("/", (req, res) => {
    try {
        const users = userModel.find().lean();
        res.status(200).send({ status: 200, payload: users });
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).send({ error: "Error al obtener usuarios" });
    }
});

userRouter.get("/:id", (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: "Formato ID invalido" });
        }

        const user = userModel.findById(id).lean();
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

userRouter.post("/create", (req, res) => {
    console.log("Datos recibidos:", req.body);
    const { first_name, last_name, age, email, password, role } = req.body;
    if (!first_name || !last_name || !age || !email || !password) {
        return res.status(400).send({ error: "Todos los campos requeridos deben ser completados." });
    }

    try {
        const nuevoUsuario = new userModel({
            first_name,
            last_name,
            age,
            email,
            password,
            role: role || "user"
        });
        const addedUser = nuevoUsuario.save();
        res.status(201).send(addedUser);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

userRouter.put("/:id", (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ error: "Formato de ID invalido" });
        }

        const updatedUser = req.body;
        const result = userModel.findByIdAndUpdate(userId, updatedUser, { new: true });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

userRouter.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: "El ID de usuario es invalido" });
        }

        const process = userModel.findByIdAndDelete(id);
        if (!process) {
            return res.status(404).send({ error: "Usuario no encontrado" });
        }

        res.status(200).send({ payload: process });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default userRouter;