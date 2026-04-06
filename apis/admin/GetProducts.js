const connectDB = require("../../db/dbConnect");
async function GetAdminProducts(req, res) {
  try {
    const db = await connectDB();
    const products = await db.collection("products").aggregate([
      { $lookup: { from: "categories", localField: "category_id", foreignField: "_id", as: "category" } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $sort: { created_at: -1 } },
    ]).toArray();
    return res.status(200).json({ success: true, message: "Products fetched successfully", data: products });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { GetAdminProducts };
