import Product from "../models/product";


const addProduct = async (productData) => {
    return await Product.create(productData);
};

const getProduct = async (productID) => {
    return await Product.findById(productID);
};

const getAllProducts = async () => {
    return await Product.find();
};

const editProduct = async (req) => {
    return await Product.findByIdAndUpdate(req.params.id, req.body, {new:true});
};

const removeProduct = async (productID) => {
    return await Product.findByIdAndDelete(productID);
};


module.exports= {
    addProduct,
    getProduct,
    getAllProducts,
    editProduct,
    removeProduct,
}






