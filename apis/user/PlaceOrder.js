const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function PlaceOrder(req, res) {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) return res.status(400).json({ success: false, message: "Product ID and quantity are required" });
    if (!ObjectId.isValid(product_id)) return res.status(400).json({ success: false, message: "Invalid product ID" });
    const qty = parseInt(quantity);
    if (qty < 1) return res.status(400).json({ success: false, message: "Quantity must be at least 1" });

    const db = await connectDB();
    const product = await db.collection("products").findOne({ _id: new ObjectId(product_id), status: "Available" });
    if (!product) return res.status(404).json({ success: false, message: "Product not found or unavailable" });
    if (product.stock < qty) return res.status(400).json({ success: false, message: `Only ${product.stock} unit(s) in stock` });

    const total_amt = product.price * qty;

    await db.collection("orders").insertOne({
      user_id: new ObjectId(req.user._id),
      product_id: new ObjectId(product_id),
      quantity: qty,
      order_date: new Date(),
      total_amt,
      status: "Placed",
      payment_status: "Pending",
    });

    const newStock = product.stock - qty;
    await db.collection("products").updateOne(
      { _id: new ObjectId(product_id) },
      { $inc: { stock: -qty }, $set: { status: newStock === 0 ? "Out_of_Stock" : "Available" } }
    );

    return res.status(201).json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("PlaceOrder.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { PlaceOrder };
