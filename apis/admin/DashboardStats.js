const connectDB = require("../../db/dbConnect");
async function DashboardStats(req, res) {
  try {
    const db = await connectDB();
    const totalUsers = await db.collection("users").countDocuments({ role: "User" });
    const totalCategories = await db.collection("categories").countDocuments({});
    const totalProducts = await db.collection("products").countDocuments({});
    const availableProducts = await db.collection("products").countDocuments({ status: "Available" });
    const outOfStock = await db.collection("products").countDocuments({ status: "Out_of_Stock" });
    const totalOrders = await db.collection("orders").countDocuments({});
    const placedOrders = await db.collection("orders").countDocuments({ status: "Placed" });
    const shippedOrders = await db.collection("orders").countDocuments({ status: "Shipped" });
    const deliveredOrders = await db.collection("orders").countDocuments({ status: "Delivered" });
    const cancelledOrders = await db.collection("orders").countDocuments({ status: "Cancelled" });

    const revenueResult = await db.collection("payments").aggregate([{ $match: { status: "Success" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).toArray();
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const ratingResult = await db.collection("feedbacks").aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]).toArray();
    const avgRating = ratingResult.length > 0 ? Math.round(ratingResult[0].avg * 10) / 10 : 0;

    const recentOrders = await db.collection("orders").aggregate([
      { $sort: { order_date: -1 } }, { $limit: 5 },
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "products", localField: "product_id", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
    ]).toArray();

    const recentPayments = await db.collection("payments").aggregate([
      { $sort: { date: -1 } }, { $limit: 5 },
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
    ]).toArray();

    return res.status(200).json({ success: true, message: "Dashboard stats fetched successfully", data: { totalUsers, totalCategories, totalProducts, availableProducts, outOfStock, totalOrders, placedOrders, shippedOrders, deliveredOrders, cancelledOrders, totalRevenue, avgRating, recentOrders, recentPayments } });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { DashboardStats };
