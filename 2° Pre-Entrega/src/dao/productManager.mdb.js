import productModel from "./models/product.model";

export class ProductManagerMDB {
    
    constructor () {
        this.products = [];
    }

    getProducts (req) {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let sort = req.query.sort;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const status = req.query.status ? req.query.status : null;
        const category = req.query.category ? req.query.category : null;
        const filter = {};

        if (limit > 10) {
            limit = 10;
        };
        if (status) {
            filter.status = status;
        };
        if (category) {
            filter.category = category;
        };

        if (sort === "asc" || sort === "desc") {
            sort = { price: sort };
        } else {
            sort = null;
        }

        try {
            const products = productModel.paginate(filter, { limit, page, sort, lean: true });
            
            products.prevLink = products.page > 1 ? `products?page=${products.page - 1}` : null;
            products.nextLink = products.page < products.totalPages ? `products?page${products.page + 1}` : null;

            return products;
        } catch (error) {
            throw error;
        }
    }

    getProductById (id) {
        try {
            if(id.length !== 24){
                throw new Error("El id debe tener 24 caracteres");
            }

            const product = productModel.findById({ _id: id });
            
            if(!product){
                throw new Error(`No se encontro el producto con el id ${id}`);
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    addProduct (product) {
        try{
            product = productModel.create(product);

            if(!product){
                throw new Error("No se pudo crear dicho producto");
            }
            return product;
        } catch (error) {
            if(error.code === 11000){
                throw new Error(`Ya existe algun producto con el codigo ${product.code}`);
            }
        }
    }

    updateProduct (id, product) {
        try {
            if(id.length !== 24){
                throw new Error("El id debe tener 24 caracteres");
            }

            product = productModel.findByIdAndUpdate({ _id: id }, product, { new: true });

            if(!product){
                throw new Error(`No se encontro algun producto con el id ${id}`);
            }
            return product;
        } catch (error) {
            if(error.code === 11000){
                throw new Error(`Ya existe algun producto con el codigo ${product.code}`);
            }
            throw error;
        }
    }

    deleteProduct (id) {
        try {
            const product = productModel.findByIdAndDelete({ _id: id });

            if(!product){
                throw new Error(`No se encontro dicho producto con el id ${id}`);
            }
            return product;
        } catch (error) {
            throw error;
        }
    }
}