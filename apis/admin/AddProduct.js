const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");
async function AddProduct(req, res) {
  try {
    const { category_id, name, description, specification, stock, price } = req.body;
    if (!category_id || !name || !description || !specification || !stock || !price) return res.status(400).json({ success: false, message: "All fields are required" });
    if (!ObjectId.isValid(category_id)) return res.status(400).json({ success: false, message: "Invalid category ID" });
    const db = await connectDB();
    const categoryExists = await db.collection("categories").findOne({ _id: new ObjectId(category_id) });
    if (!categoryExists) return res.status(404).json({ success: false, message: "Category not found" });
    const image = req.file ? `/uploads/products/${req.file.filename}` : "";
    const stockQty = parseInt(stock);
    await db.collection("products").insertOne({ category_id: new ObjectId(category_id), name, description, specification, image, stock: stockQty, price: parseInt(price), status: stockQty > 0 ? "Available" : "Out_of_Stock", created_at: new Date() });
    return res.status(201).json({ success: true, message: "Product added successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: "Internal server error" }); }
}
module.exports = { AddProduct };
