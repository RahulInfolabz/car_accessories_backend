const express = require("express");
const cors = require("cors");
const connectDB = require("./db/dbConnect");
const authMiddleware = require("./middleware/auth");
require("dotenv").config();

const { productUpload, profileUpload } = require("./multer/multer");

const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

const { GetCategories } = require("./apis/user/GetCategories");
const { GetProducts } = require("./apis/user/GetProducts");
const { GetProductDetails } = require("./apis/user/GetProductDetails");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { PlaceOrder } = require("./apis/user/PlaceOrder");
const { MyOrders } = require("./apis/user/MyOrders");
const { CancelOrder } = require("./apis/user/CancelOrder");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddFeedback } = require("./apis/user/AddFeedback");

const { GetUsers } = require("./apis/admin/GetUsers");
const { UpdateUserStatus } = require("./apis/admin/UpdateUserStatus");
const { AddCategory } = require("./apis/admin/AddCategory");
const { UpdateCategory } = require("./apis/admin/UpdateCategory");
const { DeleteCategory } = require("./apis/admin/DeleteCategory");
const { GetAdminCategories } = require("./apis/admin/GetCategories");
const { AddProduct } = require("./apis/admin/AddProduct");
const { UpdateProduct } = require("./apis/admin/UpdateProduct");
const { DeleteProduct } = require("./apis/admin/DeleteProduct");
const { GetAdminProducts } = require("./apis/admin/GetProducts");
const { GetOrders } = require("./apis/admin/GetOrders");
const { UpdateOrderStatus } = require("./apis/admin/UpdateOrderStatus");
const { GetPayments } = require("./apis/admin/GetPayments");
const { GetAdminFeedbacks } = require("./apis/admin/GetFeedbacks");
const { DashboardStats } = require("./apis/admin/DashboardStats");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:3000", "http://localhost:3001",
    "http://localhost:5173", "http://localhost:5174",
    "https://your-frontend.onrender.com", // ← replace with your actual frontend URL
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use("/uploads/products", express.static("uploads/products"));
app.use("/uploads/profiles", express.static("uploads/profiles"));

connectDB();

// ── COMMON ────────────────────────────────────────────────────────────────────
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/logout", Logout);
app.get("/session", Session);
app.post("/changePassword", ChangePassword);

// ── PUBLIC ────────────────────────────────────────────────────────────────────
app.get("/categories", GetCategories);
app.get("/products", GetProducts);
app.get("/products/:id", GetProductDetails);
app.get("/feedbacks", GetFeedbacks);

// ── USER (JWT required) ───────────────────────────────────────────────────────
app.get("/user/profile", authMiddleware, GetProfile);
app.post("/user/updateProfile", authMiddleware, profileUpload.single("profile_image"), UpdateProfile);
app.post("/user/placeOrder", authMiddleware, PlaceOrder);
app.get("/user/myOrders", authMiddleware, MyOrders);
app.post("/user/cancelOrder", authMiddleware, CancelOrder);
app.post("/user/genOrderId", authMiddleware, GenOrderId);
app.post("/user/verifyPayment", authMiddleware, VerifyPayment);
app.post("/user/addFeedback", authMiddleware, AddFeedback);

// ── ADMIN (JWT required) ──────────────────────────────────────────────────────
app.get("/admin/users", authMiddleware, GetUsers);
app.post("/admin/updateUserStatus", authMiddleware, UpdateUserStatus);
app.post("/admin/addCategory", authMiddleware, AddCategory);
app.post("/admin/updateCategory", authMiddleware, UpdateCategory);
app.get("/admin/deleteCategory/:id", authMiddleware, DeleteCategory);
app.get("/admin/categories", authMiddleware, GetAdminCategories);
app.post("/admin/addProduct", authMiddleware, productUpload.single("image"), AddProduct);
app.post("/admin/updateProduct", authMiddleware, productUpload.single("image"), UpdateProduct);
app.get("/admin/deleteProduct/:id", authMiddleware, DeleteProduct);
app.get("/admin/products", authMiddleware, GetAdminProducts);
app.get("/admin/orders", authMiddleware, GetOrders);
app.post("/admin/updateOrderStatus", authMiddleware, UpdateOrderStatus);
app.get("/admin/payments", authMiddleware, GetPayments);
app.get("/admin/feedbacks", authMiddleware, GetAdminFeedbacks);
app.get("/admin/dashboardStats", authMiddleware, DashboardStats);

app.get("/", (req, res) => { res.send("Welcome to Car Accessories Service Platform API!"); });

app.listen(PORT, () => console.log(`✅ Car Accessories server started on PORT ${PORT}!`));
