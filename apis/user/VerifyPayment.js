const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const connectDB = require("../../db/dbConnect");

async function VerifyPayment(req, res) {
  try {
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).json({ success: false, message: "All payment fields are required" });

    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (generatedSignature !== razorpay_signature) return res.status(400).json({ success: false, message: "Invalid payment signature" });

    const db = await connectDB();
    const order = await db.collection("orders").findOne({ _id: new ObjectId(order_id), user_id: new ObjectId(req.user._id) });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    await db.collection("payments").insertOne({
      order_id: new ObjectId(order_id),
      user_id: new ObjectId(req.user._id),
      amount: order.total_amt,
      payment_mode: "Razorpay",
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      status: "Success",
      date: new Date(),
    });

    await db.collection("orders").updateOne({ _id: new ObjectId(order_id) }, { $set: { payment_status: "Success", updated_at: new Date() } });

    return res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("VerifyPayment.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = { VerifyPayment };
