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


const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại http://0.0.0.0:${PORT}`);
});

