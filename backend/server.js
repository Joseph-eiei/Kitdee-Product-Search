const express = require("express");
const { Sequelize, DataTypes, Op } = require("sequelize");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Database connection
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

// Define Product model
const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Sync the model with the database
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

// Search route
app.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("name")),
            "LIKE",
            `%${query.toLowerCase()}%`,
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("brand")),
            "LIKE",
            `%${query.toLowerCase()}%`,
          ),
        ],
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for products" });
  }
});

// Add product route with file upload
app.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    console.log("File received:", req.file); // Debug log
    const { name, price, brand, remark } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = await Product.create({
      name,
      price,
      imageUrl,
      brand,
      remark,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the product" });
  }
});

// Get all products route
app.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
});

// Edit product route
app.put("/products/:id", upload.single("image"), async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { name, price, brand, remark } = req.body;
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : product.imageUrl;

    await product.update({ name, price, brand, remark, imageUrl });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product route
app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();

    res.status(204).end(); // 204 No Content response if deletion is successful
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
