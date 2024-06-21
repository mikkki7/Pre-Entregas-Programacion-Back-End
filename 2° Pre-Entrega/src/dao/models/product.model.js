import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const productsCollection = "products";

const productSchema = new mongoose.Schema({
    category: { type: String, default: "general", required: true },
    code: { type: String, required: true},
    description: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: "true",required: true },
    stock: { type: Number, required: true },
    thumbnails: { type: [String], default: [] },
    title: { type: String, required: true }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productsCollection, productSchema);

export default productModel;