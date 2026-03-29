const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "car_accessories";

async function seed() {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db(DB_NAME);

  console.log("🌱 Starting seed...");

  await db.collection("users").deleteMany({});
  await db.collection("categories").deleteMany({});
  await db.collection("products").deleteMany({});
  await db.collection("orders").deleteMany({});
  await db.collection("payments").deleteMany({});
  await db.collection("feedbacks").deleteMany({});

  console.log("🗑️  Cleared existing collections");

  // ── Users ─────────────────────────────────────────────────────────────────
  const usersResult = await db.collection("users").insertMany([
    {
      name: "Admin User",
      email: "admin@caracc.com",
      phone: "9900000001",
      address: "Admin Office, Ahmedabad",
      password: "Admin@123",
      profile_image: "",
      role: "Admin",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Karan Desai",
      email: "karan@gmail.com",
      phone: "9900000002",
      address: "22, Satellite Road, Ahmedabad",
      password: "Karan@123",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
    {
      name: "Sneha Patel",
      email: "sneha@gmail.com",
      phone: "9900000003",
      address: "45, Bodakdev, Ahmedabad",
      password: "Sneha@123",
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    },
  ]);

  const userIds = Object.values(usersResult.insertedIds);
  console.log("✅ Users seeded");

  // ── Categories ────────────────────────────────────────────────────────────
  const categoriesResult = await db.collection("categories").insertMany([
    { name: "Interior", status: "Active", created_at: new Date() },
    { name: "Exterior", status: "Active", created_at: new Date() },
    { name: "Electronics", status: "Active", created_at: new Date() },
    { name: "Safety & Security", status: "Active", created_at: new Date() },
    { name: "Cleaning & Maintenance", status: "Active", created_at: new Date() },
    { name: "Lighting", status: "Active", created_at: new Date() },
  ]);

  const categoryIds = Object.values(categoriesResult.insertedIds);
  console.log("✅ Categories seeded");

  // ── Products ──────────────────────────────────────────────────────────────
  const productsResult = await db.collection("products").insertMany([
    // Interior
    {
      category_id: categoryIds[0],
      name: "Premium Leather Seat Cover",
      description: "High-quality waterproof leather seat cover with anti-slip backing. Fits all standard car seats.",
      specification: "Waterproof, Anti-slip, Universal fit, Leatherette material, Available in Black/Beige",
      image: "",
      stock: 50,
      price: 2500,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0],
      name: "3D Floor Mat Set",
      description: "Custom-fit 3D floor mats with raised edges to trap dirt and water. Easy to clean.",
      specification: "Custom 3D design, Raised edges, Non-slip base, Anti-odour material, Set of 4",
      image: "",
      stock: 40,
      price: 1800,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[0],
      name: "Wooden Dashboard Trim Kit",
      description: "Elegant wooden finish dashboard trim kit for car interior enhancement.",
      specification: "Real wood veneer, Easy peel & stick installation, Compatible with most sedans/SUVs",
      image: "",
      stock: 25,
      price: 3200,
      status: "Available",
      created_at: new Date(),
    },
    // Exterior
    {
      category_id: categoryIds[1],
      name: "Car Body Side Moulding (Set of 4)",
      description: "Chrome finish body side moulding to protect door panels from dings and scratches.",
      specification: "Chrome finish, Self-adhesive, 4 pieces, Universal fit 4-door cars",
      image: "",
      stock: 30,
      price: 1200,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[1],
      name: "Roof Spoiler - Sports Style",
      description: "Aerodynamic ABS roof spoiler for sports and sedan vehicles. Enhances vehicle appearance.",
      specification: "ABS plastic, Primer coated (paintable), Universal fit for hatchbacks, Screwless install",
      image: "",
      stock: 15,
      price: 4500,
      status: "Available",
      created_at: new Date(),
    },
    // Electronics
    {
      category_id: categoryIds[2],
      name: "7-inch Android Car Stereo",
      description: "Full HD 7-inch Android touchscreen stereo with GPS, Bluetooth, and rear camera support.",
      specification: "7-inch IPS display, Android 12, GPS, BT5.0, USB, AUX, Rear camera input, 2GB RAM",
      image: "",
      stock: 20,
      price: 8500,
      status: "Available",
      created_at: new Date(),
    },
    {
      category_id: categoryIds[2],
      name: "Wireless Car Charger Mount",
      description: "15W fast wireless charging car phone mount. Auto-clamping design for one-hand operation.",
      specification: "15W Qi wireless, Auto-clamp, 360° rotation, Dashboard/windshield mount, Compatible all phones",
      image: "",
      stock: 60,
      price: 1500,
      status: "Available",
      created_at: new Date(),
    },
    // Safety
    {
      category_id: categoryIds[3],
      name: "Dash Camera 1080P Full HD",
      description: "Front and rear 1080P dual dash camera with night vision, loop recording, and G-sensor.",
      specification: "1080P FHD, 170° wide angle, Night vision, Loop recording, G-sensor, Rear cam included",
      image: "",
      stock: 35,
      price: 3800,
      status: "Available",
      created_at: new Date(),
    },
    // Cleaning
    {
      category_id: categoryIds[4],
      name: "Car Interior Cleaning Kit",
      description: "Complete 12-piece car interior cleaning kit for dashboard, seats, and upholstery.",
      specification: "12-piece kit, Microfiber cloths, Interior cleaner spray, Brush set, Foam applicator",
      image: "",
      stock: 80,
      price: 950,
      status: "Available",
      created_at: new Date(),
    },
    // Lighting
    {
      category_id: categoryIds[5],
      name: "LED Ambient Interior Light Strip",
      description: "USB-powered RGB LED strip with app control for 16 million colors. Easy peel-and-stick install.",
      specification: "RGB 16M colors, App control, USB powered, 4m length, Waterproof, Sync with music",
      image: "",
      stock: 70,
      price: 799,
      status: "Available",
      created_at: new Date(),
    },
  ]);

  const productIds = Object.values(productsResult.insertedIds);
  console.log("✅ Products seeded");

  // ── Orders ────────────────────────────────────────────────────────────────
  const ordersResult = await db.collection("orders").insertMany([
    {
      user_id: userIds[1], // Karan
      product_id: productIds[0], // Leather Seat Cover
      quantity: 2,
      order_date: new Date("2025-12-10"),
      total_amt: 5000,
      status: "Delivered",
      payment_status: "Success",
    },
    {
      user_id: userIds[2], // Sneha
      product_id: productIds[5], // Android Stereo
      quantity: 1,
      order_date: new Date("2025-12-15"),
      total_amt: 8500,
      status: "Shipped",
      payment_status: "Success",
    },
    {
      user_id: userIds[1], // Karan
      product_id: productIds[7], // Dash Camera
      quantity: 1,
      order_date: new Date(),
      total_amt: 3800,
      status: "Placed",
      payment_status: "Pending",
    },
  ]);

  const orderIds = Object.values(ordersResult.insertedIds);
  console.log("✅ Orders seeded");

  // ── Payments ──────────────────────────────────────────────────────────────
  await db.collection("payments").insertMany([
    {
      order_id: orderIds[0],
      user_id: userIds[1],
      amount: 5000,
      payment_mode: "Razorpay",
      razorpay_order_id: "order_demo_001",
      razorpay_payment_id: "pay_demo_001",
      razorpay_signature: "sig_demo_001",
      status: "Success",
      date: new Date("2025-12-10"),
    },
    {
      order_id: orderIds[1],
      user_id: userIds[2],
      amount: 8500,
      payment_mode: "Razorpay",
      razorpay_order_id: "order_demo_002",
      razorpay_payment_id: "pay_demo_002",
      razorpay_signature: "sig_demo_002",
      status: "Success",
      date: new Date("2025-12-15"),
    },
  ]);

  console.log("✅ Payments seeded");

  // ── Feedbacks ─────────────────────────────────────────────────────────────
  await db.collection("feedbacks").insertMany([
    {
      user_id: userIds[1],
      booking_id: orderIds[0], // booking_id = order_id as per DD
      rating: 5.0,
      feedback: "Very good service and affordable price. The leather seat covers are premium quality and fit perfectly!",
      datetime: new Date("2025-12-12"),
    },
    {
      user_id: userIds[2],
      booking_id: orderIds[1],
      rating: 4.5,
      feedback: "Excellent Android stereo. Easy installation and crystal clear display. Great product!",
      datetime: new Date("2025-12-17"),
    },
  ]);

  console.log("✅ Feedbacks seeded");

  console.log("\n🎉 Seed completed successfully!");
  console.log("──────────────────────────────────────────");
  console.log("👤 Admin   → admin@caracc.com    / Admin@123");
  console.log("👤 User 1  → karan@gmail.com     / Karan@123");
  console.log("👤 User 2  → sneha@gmail.com     / Sneha@123");
  console.log("──────────────────────────────────────────");

  await client.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
