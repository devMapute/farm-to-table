import OrderTransaction from "../models/order_transaction";


const addTransaction = async (orderTransactionData) => {
    return await OrderTransaction.create(orderTransactionData);
};

const getTransaction = async (transactionID) => {
    return await OrderTransaction.findById(transactionID);
};

const getAllTransactions = async () => {
    return await OrderTransaction.find();
};

const editTransaction = async (req) => {
    return await OrderTransaction.findByIdAndUpdate(req.params.id, req.body, {new:true});
};

const removeTransaction = async (transactionID) => {
    return await OrderTransaction.findByIdAndDelete(transactionID);
};


module.exports= {
    addTransaction,
    getTransaction,
    getAllTransactions,
    editTransaction,
    removeTransaction
}






