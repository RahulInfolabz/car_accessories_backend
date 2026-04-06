const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function MyOrders(req, res) {
  try {
    const db = await connectDB();
    const orders = await db.collection("orders").aggregate([
      { $match: { user_id: new ObjectId(req.user._id) } },
      { $lookup: { from: "products", localField: "product_id", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "categories", localField: "product.category_id", foreignField: "_id", as: "category" } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $sort: { order_date: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Orders fetched successfully", data: orders });
  } catch (error) {
    console.error("MyOrders.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { MyOrders };
