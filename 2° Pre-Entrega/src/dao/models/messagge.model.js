import mongoose from "mongoose";

mongoose.pluralize(null);

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
    user: { type: String, require: true },
    message: { type: String, require: true }
}, { timestamps: true });

const messageModel = mongoose.model(messagesCollection, messageSchema);

export default messageModel;