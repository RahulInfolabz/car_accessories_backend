const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function CancelOrder(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth || user.session.role !== "User") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { order_id } = req.body;

    if (!order_id || !ObjectId.isValid(order_id)) {
      return res.status(400).json({ success: false, message: "Valid order ID is required" });
    }

    const db = await connectDB();
    const orderCollection = db.collection("orders");
    const productCollection = db.collection("products");

    const order = await orderCollection.findOne({
      _id: new ObjectId(order_id),
      user_id: new ObjectId(user.session._id),
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Order is already cancelled" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ success: false, message: "Delivered orders cannot be cancelled" });
    }

    // Cancel order
    await orderCollection.updateOne(
      { _id: new ObjectId(order_id) },
      { $set: { status: "Cancelled", updated_at: new Date() } }
    );

    // Restore stock
    await productCollection.updateOne(
      { _id: order.product_id },
      {
        $inc: { stock: order.quantity },
        $set: { status: "Available" },
      }
    );

    return res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("CancelOrder.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { CancelOrder };
