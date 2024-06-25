import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    enum: ['Crops', 'Poultry', 'Fruits', 'Vegetables', 'Dairy Products', 'Grains and Legumes', 'Herbs and Spices'],
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productDesc: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  imgURL :{
    type: String,
    required: true
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;