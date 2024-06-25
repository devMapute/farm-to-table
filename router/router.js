import {jwtDecode} from 'jwt-decode';
import {
  addUser,
  getProducts,
  addProduct,
  getUser,
  getUsers,
  login,
  addOrder,
  getOrders,
  deleteOrder,
  getAllOrders,
  updateProduct,
  updateOrder,
  getSalesReport
} from "../api/farmtotable-controller.js";

// Middleware to extract user ID from JWT token
const extractUserId = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const tokenWithoutBearer = token.replace('Bearer ', '');
    const decodedToken = jwtDecode(tokenWithoutBearer);
    // console.log(decodedToken)
    req.user = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Middleware to check if user is admin
const authorizeAdmin = (req, res, next) => {
  if (req.user.userId !== "6650160f0b6714346b51519e") {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

export default function router(app) {
  // Allow Cross Origin Resource Sharing
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
    );
    next();
  });

  // Public routes
  app.get("/signup", getUser);
  app.post("/signup", addUser);
  app.post("/signin", login);
  app.post("/add-product", addProduct);

  // All users can do this if they have token
  app.get("/products", getProducts);
  app.post("/add-order", addOrder);
  app.get("/orders/:userId", getOrders);



  // Protected routes for admin only
  app.use(extractUserId); // Middleware to extract user ID from JWT token
  app.use(authorizeAdmin); // All routes below this line require admin authorization
  
  app.get("/users", getUsers);
  app.delete("/orders/:orderId", deleteOrder);
  app.get("/orders", getAllOrders);
  app.put("/products/:productId", updateProduct);
  app.put("/orders/:orderId", updateOrder);
  app.get("/sales-report/:period", getSalesReport);

  // Catch-all route for unauthorized access
  app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });
}
