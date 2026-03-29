const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateOrderStatus(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id, status } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Valid order ID is required" });
    }

    const validStatuses = ["Placed", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const db = await connectDB();
    const orderCollection = db.collection("orders");

    const order = await orderCollection.findOne({ _id: new ObjectId(id) });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Restore stock if admin cancels
    if (status === "Cancelled" && order.status !== "Cancelled") {
      await db.collection("products").updateOne(
        { _id: order.product_id },
        { $inc: { stock: order.quantity }, $set: { status: "Available" } }
      );
    }

    await orderCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updated_at: new Date() } }
    );

    return res.status(200).json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("UpdateOrderStatus.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { UpdateOrderStatus };
