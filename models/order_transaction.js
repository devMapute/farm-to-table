import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderTransactionSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    default: 'Cash on Delivery',
  },
  confirmedByMerchant: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const OrderTransaction = mongoose.model('OrderTransaction', orderTransactionSchema);
export default OrderTransaction;
