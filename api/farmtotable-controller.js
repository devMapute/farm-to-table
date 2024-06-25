import mongoose from "mongoose";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Product from "../models/product.js";
import OrderTransaction from "../models/order_transaction.js"; 
dotenv.config();
const SECRET_KEY = "secretkey";

const FTB_MONGODB_URI =
  "";

await mongoose.connect(FTB_MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
  app.listen(3001, () => {
    console.log("Server is connected to port 3001 and connected to MongoDB");
  });
});

mongoose.connection.on("error", (error) => {
  console.log("Unable to connect to MongoDB:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

const addUser = async (req, res) => {
  try {
    const { firstName, lastName, userType, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      userType,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error signing up" });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: "Unable to get Users" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving users" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1hr",
    });
    res.json({ message: "Login successful!", token: token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

const addProduct = async (req, res) => {
  try {
    console.log(req)
    const { productName, productType, productPrice, productDesc, quantity, imgURL } =
      req.body;

    const newProduct = new Product({
      productName,
      productType,
      productPrice,
      productDesc,
      quantity,
      imgURL
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.log("test",newProduct)
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Error adding product" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving products" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { productName, productType, productPrice, productDesc, quantity, imgURL } = req.body;

    // Check if the product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product fields if provided in the request body
    if (productName) existingProduct.productName = productName;
    if (productType) existingProduct.productType = productType;
    if (productPrice !== undefined) existingProduct.productPrice = productPrice; 
    if (productDesc) existingProduct.productDesc = productDesc;
    if (quantity !== undefined) existingProduct.quantity = quantity; 
    if (imgURL) existingProduct.imgURL = imgURL;

    await existingProduct.save();

    res.status(200).json({ message: 'Product updated successfully', updatedProduct: existingProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
};



const addOrder = async (req, res) => {
  try {
    const { user, products, totalAmount } = req.body;

    // Check if the required fields are present and valid
    if (!user || !products || !totalAmount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newOrder = new OrderTransaction({
      user,
      products: products.map(product => ({
        product: product.product,
        quantity: product.quantity,
        productPrice: product.productPrice,
      })),
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', newOrder });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: 'Error adding order' });
  }
};


const getOrders = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from request parameters
    const orders = await OrderTransaction.find({ user: userId })
      .populate('user', 'firstName lastName email')
      .populate('products.product', 'productName productType productPrice productDesc imgURL');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ error: 'Error retrieving orders' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderTransaction.find()
      .populate('user', 'firstName lastName email')
      .populate('products.product', 'productName productType productPrice productDesc imgURL');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ error: 'Error retrieving orders' });
  }
};


const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await OrderTransaction.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
    
  } catch (error) {
    console.error('Error deleting order:');
    res.status(500).json({ error: 'Error deleting order' });
  }
};

const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { confirmedByMerchant, status } = req.body;

  try {
    const order = await OrderTransaction.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status and confirmation status
    order.status = status;
    order.confirmedByMerchant = confirmedByMerchant;
    await order.save();

    // If order is confirmed and status is Delivered, update product quantities
    if (confirmedByMerchant && status === 'Delivered') {
      for (const product of order.products) {
        const { product: productId, quantity } = product;
        const { quantity: orderedQuantity } = await Product.findById(productId);
        const remainingQuantity = orderedQuantity - quantity;
        await Product.findByIdAndUpdate(productId, { quantity: remainingQuantity });
      }
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const groupTransactions = (transactions, period) => {
  const groupedTransactions = {};

  transactions.forEach((transaction) => {
    let key;
    const date = new Date(transaction.createdAt);

    switch (period) {
      case 'weekly':
        const week = getWeek(date);
        key = `${date.getFullYear()}-W${week}`;
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      case 'annually':
        key = `${date.getFullYear()}`;
        break;
      default:
        throw new Error('Invalid period specified');
    }

    if (!groupedTransactions[key]) {
      groupedTransactions[key] = [];
    }
    groupedTransactions[key].push(transaction);
  });

  return groupedTransactions;
};

// Function to get the week number of a date
const getWeek = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Function to calculate sales report
const calculateSalesReport = (groupedTransactions) => {
  const salesReport = [];

  for (const period in groupedTransactions) {
    if (Object.hasOwnProperty.call(groupedTransactions, period)) {
      const transactions = groupedTransactions[period];

      // Calculate total sales for this period
      const totalSales = transactions.reduce((total, transaction) => {
        return total + transaction.totalAmount;
      }, 0);

      // Calculate sales income by product
      const productsSales = calculateSalesByProduct(transactions);

      // Construct the sales report object
      salesReport.push({
        period,
        totalSales,
        products: productsSales,
      });
    }
  }

  return salesReport;
};

// Function to calculate sales income by product
const calculateSalesByProduct = (transactions) => {
  const salesByProduct = {};

  transactions.forEach((transaction) => {
    transaction.products.forEach((product) => {
      if (!salesByProduct[product.product]) {
        salesByProduct[product.product] = {
          productName: product.productName,
          salesIncome: 0,
        };
      }

      salesByProduct[product.product].salesIncome += product.quantity * product.productPrice;
    });
  });

  return Object.values(salesByProduct);
};

// Function to generate sales report
const generateSalesReport = async (period) => {
  let startDate;
  const endDate = new Date();

  switch (period) {
    case "weekly":
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "monthly":
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "annually":
      startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      throw new Error("Invalid period specified");
  }

  const salesData = await OrderTransaction.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: "Delivered",
      },
    },
    {
      $unwind: "$products",
    },
    {
      $group: {
        _id: "$products.product",
        totalSales: { $sum: "$products.productPrice" },
        totalQuantity: { $sum: "$products.quantity" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $project: {
        productName: "$productDetails.productName",
        productType: "$productDetails.productType",
        totalSales: 1,
        totalQuantity: 1,
      },
    },
  ]);

  return {
    period,
    startDate,
    endDate,
    salesData,
  };
};

// Route handler for sales report
const getSalesReport = async (req, res) => {
  const { period } = req.params;

  if (!["weekly", "monthly", "annually"].includes(period)) {
    return res.status(400).json({ error: "Invalid period specified" });
  }

  try {
    const salesReport = await generateSalesReport(period);
    res.status(200).json(salesReport);
  } catch (error) {
    console.error("Error fetching sales report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export { addUser, getUser, login, addProduct, getProducts, getUsers, addOrder, getAllOrders,  getOrders, deleteOrder , updateProduct, updateOrder, getSalesReport};
