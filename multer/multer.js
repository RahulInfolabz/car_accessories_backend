const multer = require("multer");
const path = require("path");

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profiles"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) { cb(null, true); }
  else { cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)")); }
};

const productUpload = multer({ storage: productStorage, fileFilter: imageFilter });
const profileUpload = multer({ storage: profileStorage, fileFilter: imageFilter });

module.exports = { productUpload, profileUpload };
