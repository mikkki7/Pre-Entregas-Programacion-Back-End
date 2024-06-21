import mongoose from "mongoose";

mongoose.pluralize(null);

const userCollection = "users";

const  userSchema = new mongoose.Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    age: { type: Number, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, require: true, enum: ["admin", "user", "no-log"], default: "no-log" }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;