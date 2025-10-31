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


// 🏠 Trang chủ: hiển thị toàn bộ sản phẩm + form thêm
app.get("/", (req, res) => {
  const { success, error } = req.query;
  const sql = "SELECT * FROM products ORDER BY id ASC"; // lấy danh sách sản phẩm

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi tải danh sách sản phẩm:", err);
      res.render("index", { success, error, products: [] });
    } else {
      res.render("index", { success, error, products: results });
    }
  });
});


// ➕ Thêm sản phẩm
app.post("/add", (req, res) => {
  const { name, price } = req.body;
  const sql = "INSERT INTO products (name, price) VALUES (?, ?)";

  connection.query(sql, [name, price], (err) => {
    if (err) {
      console.error("❌ Lỗi khi thêm sản phẩm:", err);
      res.redirect("/?error=1");
    } else {
      console.log("✅ Thêm sản phẩm thành công!");
      res.redirect("/?success=1");
    }
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
      console.error("❌ Lỗi khi tìm kiếm sản phẩm:", err);
      res.send("❌ Lỗi khi tìm kiếm sản phẩm!");
    } else {
      res.render("search", { products: results, searched: true });
    }
  });
});


// 🗑️ Xóa sản phẩm
app.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM products WHERE id = ?";

  connection.query(sql, [id], (err) => {
    if (err) {
      console.error("❌ Lỗi khi xóa sản phẩm:", err);
      res.redirect("/?error=1");
    } else {
      console.log(`🗑️ Đã xóa sản phẩm ID ${id}`);
      res.redirect("/?success=1");
    }
  });
});


// ✏️ Trang sửa sản phẩm
app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM products WHERE id = ?";
  connection.query(sql, [req.params.id], (err, results) => {
    if (err || results.length === 0) {
      res.send("❌ Không tìm thấy sản phẩm!");
    } else {
      res.render("edit", { product: results[0] });
    }
  });
});


// ✅ Cập nhật sản phẩm
app.post("/edit/:id", (req, res) => {
  const { name, price } = req.body;
  const sql = "UPDATE products SET name=?, price=? WHERE id=?";

  connection.query(sql, [name, price, req.params.id], (err) => {
    if (err) {
      console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
      res.send("❌ Lỗi khi cập nhật sản phẩm!");
    } else {
      console.log(`✏️ Đã cập nhật sản phẩm ID ${req.params.id}`);
      res.redirect("/");
    }
  });
});


// 🚀 Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại http://0.0.0.0:${PORT}`);
});
