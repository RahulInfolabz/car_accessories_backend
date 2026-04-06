const connectDB = require("../../db/dbConnect");
async function GetAdminFeedbacks(req, res) {
  try {
    const db = await connectDB();
    const feedbacks = await db.collection("feedbacks").aggregate([
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "orders", localField: "booking_id", foreignField: "_id", as: "order" } },
      { $unwind: { path: "$order", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "products", localField: "order.product_id", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $project: { "user.password": 0 } },
      { $sort: { datetime: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Feedbacks fetched successfully", data: feedbacks });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { GetAdminFeedbacks };
