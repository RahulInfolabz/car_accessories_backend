const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateProduct(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id, category_id, name, description, specification, stock, price, status } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Valid product ID is required" });
    }

    const db = await connectDB();
    const updateFields = { updated_at: new Date() };

    if (category_id && ObjectId.isValid(category_id)) updateFields.category_id = new ObjectId(category_id);
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (specification) updateFields.specification = specification;
    if (stock !== undefined) {
      updateFields.stock = parseInt(stock);
      updateFields.status = parseInt(stock) > 0 ? "Available" : "Out_of_Stock";
    }
    if (price) updateFields.price = parseInt(price);
    if (status) updateFields.status = status;
    if (req.file) updateFields.image = `/uploads/products/${req.file.filename}`;

    const result = await db.collection("products").updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("UpdateProduct.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { UpdateProduct };
