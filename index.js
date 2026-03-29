const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./db/dbConnect");
require("dotenv").config();

// ── Multer ────────────────────────────────────────────────────────────────────
const { productUpload, profileUpload } = require("./multer/multer");

// ── Common ────────────────────────────────────────────────────────────────────
const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

// ── Public ────────────────────────────────────────────────────────────────────
const { GetCategories } = require("./apis/user/GetCategories");
const { GetProducts } = require("./apis/user/GetProducts");
const { GetProductDetails } = require("./apis/user/GetProductDetails");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

// ── User ──────────────────────────────────────────────────────────────────────
const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { PlaceOrder } = require("./apis/user/PlaceOrder");
const { MyOrders } = require("./apis/user/MyOrders");
const { CancelOrder } = require("./apis/user/CancelOrder");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddFeedback } = require("./apis/user/AddFeedback");

// ── Admin ─────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "car_accessories_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


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
// filters: ?category_id= ?min_price= ?max_price=
app.get("/products", GetProducts);
app.get("/products/:id", GetProductDetails);
app.get("/feedbacks", GetFeedbacks);

// ── USER ──────────────────────────────────────────────────────────────────────
app.get("/user/profile", GetProfile);
app.post("/user/updateProfile", profileUpload.single("profile_image"), UpdateProfile);
app.post("/user/placeOrder", PlaceOrder);
app.get("/user/myOrders", MyOrders);
app.post("/user/cancelOrder", CancelOrder);
app.post("/user/genOrderId", GenOrderId);
app.post("/user/verifyPayment", VerifyPayment);
app.post("/user/addFeedback", AddFeedback);

// ── ADMIN ─────────────────────────────────────────────────────────────────────
app.get("/admin/users", GetUsers);
app.post("/admin/updateUserStatus", UpdateUserStatus);

app.post("/admin/addCategory", AddCategory);
app.post("/admin/updateCategory", UpdateCategory);
app.get("/admin/deleteCategory/:id", DeleteCategory);
app.get("/admin/categories", GetAdminCategories);

app.post("/admin/addProduct", productUpload.single("image"), AddProduct);
app.post("/admin/updateProduct", productUpload.single("image"), UpdateProduct);
app.get("/admin/deleteProduct/:id", DeleteProduct);
app.get("/admin/products", GetAdminProducts);

app.get("/admin/orders", GetOrders);
app.post("/admin/updateOrderStatus", UpdateOrderStatus);

app.get("/admin/payments", GetPayments);
app.get("/admin/feedbacks", GetAdminFeedbacks);
app.get("/admin/dashboardStats", DashboardStats);


app.get("/", (req, res) => {
  res.send("Welcome to Car Accessories Service Platform API!");
});


// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅ Car Accessories server started on PORT ${PORT}!`)
);
