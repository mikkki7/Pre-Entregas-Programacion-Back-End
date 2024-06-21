import mongoose from "mongoose";

mongoose.pluralize(null);

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
    _user_id: { type: mongoose.Schema.Types.ObjectId, ref: "_users_index", required: true },
    products: { type: [{ _id: mongoose.Schema.Types.ObjectId, quantity: Number }], ref: "products", required: true }
});

cartSchema.pre("find", function () {
    this.populate({ path: "_user_id", model: userModel })
    .populate({ path: "products._id", model: productModel });
});
const cartModel = mongoose.model(cartsCollection, cartSchema);

export default cartModel;