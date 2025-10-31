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

// Trang chủ
app.get("/", (req, res) => {
  const { success, error } = req.query;
  res.render("index", { success, error });
});


// Thêm sản phẩm
app.post("/add", (req, res) => {
  const { name, price } = req.body;
  const sql = "INSERT INTO products (name, price) VALUES (?, ?)";
  connection.query(sql, [name, price], (err) => {
    if (err) {
      res.redirect("/?error=1");
    } else {
      console.log("✅ Thêm sản phẩm thành công!");
      res.redirect("/?success=1"); // chuyển hướng về trang chủ kèm thông báo
    }
  });
});


// Tìm kiếm sản phẩm
app.get("/search", (req, res) => {
  const { keyword } = req.query;

  // ✅ Nếu chưa nhập từ khóa (vừa mở trang tìm kiếm)
  if (!keyword) {
    return res.render("search", { products: [], searched: false });
  }

  // ✅ Nếu có từ khóa, thực hiện truy vấn
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  connection.query(sql, [`%${keyword}%`], (err, results) => {
    if (err) {
      res.send("❌ Lỗi khi tìm kiếm sản phẩm!");
    } else {
      res.render("search", { products: results, searched: true });
    }
  });
});

// Hiển thị danh sách tất cả sản phẩm
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY id DESC";
  connection.query(sql, (err, results) => {
    if (err) {
      return res.send("❌ Lỗi khi tải sản phẩm!");
    }
    res.render("products", { products: results });
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
      console.log(`🗑️ Đã xóa sản phẩm có ID ${id}`);
      res.redirect("/?success=1");
    }
  });
});


// Trang sửa sản phẩm
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

// Cập nhật sản phẩm
app.post("/edit/:id", (req, res) => {
  const { name, price } = req.body;
  const sql = "UPDATE products SET name=?, price=? WHERE id=?";
  connection.query(sql, [name, price, req.params.id], (err) => {
    if (err) {
      res.send("❌ Lỗi khi cập nhật sản phẩm!");
    } else {
      res.redirect("/products");
    }
  });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại http://0.0.0.0:${PORT}`);
});

