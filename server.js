import express from "express";
import dotenv from "dotenv";
import connection from "./db.js";
import path from "path";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ⭐ Khi truy cập "/", chuyển hướng tới /products
app.get("/", (req, res) => {
  res.redirect("/products");
});


// ⭐ Trang thêm sản phẩm (GET)
app.get("/add", (req, res) => {
  const { success, error } = req.query;
  res.render("index", { success, error });
});


// ➕ Thêm sản phẩm (POST)
app.post("/add", (req, res) => {
  const { name, price } = req.body;
  const sql = "INSERT INTO products (name, price) VALUES (?, ?)";
  
  connection.query(sql, [name, price], (err) => {
    if (err) {
      console.error("❌ Lỗi khi thêm sản phẩm:", err);
      return res.redirect("/add?error=1");
    }

    console.log("✅ Thêm sản phẩm thành công!");
    res.redirect("/products?success=1");
  });
});


// 📋 Danh sách sản phẩm
app.get("/products", (req, res) => {
  const { success, error } = req.query;
  const sql = "SELECT * FROM products ORDER BY id ASC";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi tải danh sách:", err);
      return res.render("products", { success, error, products: [] });
    }

    res.render("products", { success, error, products: results });
  });
});


// 🗑️ Xóa sản phẩm
app.post("/delete/:id", (req, res) => {
  const { id } = req.params;

  const deleteSql = "DELETE FROM products WHERE id = ?";
  connection.query(deleteSql, [id], (err) => {
    if (err) {
      console.error("❌ Lỗi xóa sản phẩm:", err);
      return res.redirect("/products?error=1");
    }

    console.log(`🗑️ Đã xóa sản phẩm ID ${id}`);

    // Reset ID nếu bảng trống
    const checkSql = "SELECT COUNT(*) AS total FROM products";
    connection.query(checkSql, (err, results) => {
      if (!err && results[0].total === 0) {
        connection.query("ALTER TABLE products AUTO_INCREMENT = 1");
      }
      res.redirect("/products?success=1");
    });
  });
});


// ✏️ Trang sửa sản phẩm
app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM products WHERE id = ?";

  connection.query(sql, [req.params.id], (err, results) => {
    if (err || results.length === 0) {
      return res.send("❌ Không tìm thấy sản phẩm!");
    }

    res.render("edit", { product: results[0] });
  });
});


// ✏️ Cập nhật sản phẩm
app.post("/edit/:id", (req, res) => {
  const { name, price } = req.body;
  const sql = "UPDATE products SET name=?, price=? WHERE id=?";

  connection.query(sql, [name, price, req.params.id], (err) => {
    if (err) {
      console.error("❌ Lỗi cập nhật:", err);
      return res.send("❌ Lỗi cập nhật sản phẩm!");
    }

    console.log(`✏️ Đã cập nhật sản phẩm ID ${req.params.id}`);
    res.redirect("/products?success=1");
  });
});


// 🔍 Tìm kiếm sản phẩm
app.get("/search", (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.render("search", { products: [], searched: false });
  }

  const sql = "SELECT * FROM products WHERE name LIKE ?";
  connection.query(sql, [`%${keyword}%`], (err, results) => {
    if (err) {
      console.error("❌ Lỗi tìm kiếm:", err);
      return res.send("❌ Lỗi tìm kiếm!");
    }

    res.render("search", { products: results, searched: true });
  });
});


// 🚀 Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại http://0.0.0.0:${PORT}`);
});
