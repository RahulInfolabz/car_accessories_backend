const connectDB = require("../../db/dbConnect");
async function GetOrders(req, res) {
  try {
    const db = await connectDB();
    const orders = await db.collection("orders").aggregate([
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "products", localField: "product_id", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "categories", localField: "product.category_id", foreignField: "_id", as: "category" } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
      { $sort: { order_date: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Orders fetched successfully", data: orders });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { GetOrders };
