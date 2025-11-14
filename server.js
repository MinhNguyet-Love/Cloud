// import express from "express";
// import dotenv from "dotenv";
// import connection from "./db.js";
// import path from "path";

// dotenv.config();
// const app = express();
// const __dirname = path.resolve();

// app.use(express.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));


// // 🏠 Trang chủ: chỉ có form thêm
// app.get("/", (req, res) => {
//   const { success, error } = req.query;
//   res.render("index", { success, error });
// });


// // ➕ Thêm sản phẩm
// app.post("/add", (req, res) => {
//   const { name, price } = req.body;
//   const sql = "INSERT INTO products (name, price) VALUES (?, ?)";
//   connection.query(sql, [name, price], (err) => {
//     if (err) {
//       console.error("❌ Lỗi khi thêm sản phẩm:", err);
//       res.redirect("/?error=1");
//     } else {
//       console.log("✅ Thêm sản phẩm thành công!");
//       res.redirect("/products?success=1");
//     }
//   });
// });


// // 📋 Danh sách sản phẩm
// app.get("/products", (req, res) => {
//   const { success, error } = req.query;
//   const sql = "SELECT * FROM products ORDER BY id ASC";

//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error("❌ Lỗi khi tải danh sách:", err);
//       res.render("products", { success, error, products: [] });
//     } else {
//       res.render("products", { success, error, products: results });
//     }
//   });
// });

// // 🗑️ Xóa sản phẩm
// app.post("/delete/:id", (req, res) => {
//   const { id } = req.params;
//   const deleteSql = "DELETE FROM products WHERE id = ?";

//   connection.query(deleteSql, [id], (err) => {
//     if (err) {
//       console.error("❌ Lỗi khi xóa sản phẩm:", err);
//       return res.redirect("/products?error=1");
//     }

//     console.log(`🗑️ Đã xóa sản phẩm ID ${id}`);

//     // ✅ Kiểm tra nếu bảng trống, reset AUTO_INCREMENT về 1
//     const checkSql = "SELECT COUNT(*) AS total FROM products";
//     connection.query(checkSql, (err, results) => {
//       if (!err && results[0].total === 0) {
//         const resetSql = "ALTER TABLE products AUTO_INCREMENT = 1";
//         connection.query(resetSql, (err) => {
//           if (err) console.error("⚠️ Không thể reset ID:", err);
//           else console.log("🔄 Đã reset ID về 1 vì bảng trống!");
//         });
//       }
//       res.redirect("/products?success=1");
//     });
//   });
// });



// // ✏️ Trang sửa sản phẩm
// app.get("/edit/:id", (req, res) => {
//   const sql = "SELECT * FROM products WHERE id = ?";
//   connection.query(sql, [req.params.id], (err, results) => {
//     if (err || results.length === 0) {
//       res.send("❌ Không tìm thấy sản phẩm!");
//     } else {
//       res.render("edit", { product: results[0] });
//     }
//   });
// });


// // ✅ Cập nhật sản phẩm
// app.post("/edit/:id", (req, res) => {
//   const { name, price } = req.body;
//   const sql = "UPDATE products SET name=?, price=? WHERE id=?";

//   connection.query(sql, [name, price, req.params.id], (err) => {
//     if (err) {
//       console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
//       res.send("❌ Lỗi khi cập nhật sản phẩm!");
//     } else {
//       console.log(`✏️ Đã cập nhật sản phẩm ID ${req.params.id}`);
//       res.redirect("/products?success=1");
//     }
//   });
// });


// // 🔍 Tìm kiếm sản phẩm
// app.get("/search", (req, res) => {
//   const { keyword } = req.query;
//   if (!keyword) {
//     return res.render("search", { products: [], searched: false });
//   }

//   const sql = "SELECT * FROM products WHERE name LIKE ?";
//   connection.query(sql, [`%${keyword}%`], (err, results) => {
//     if (err) {
//       console.error("❌ Lỗi khi tìm kiếm:", err);
//       res.send("❌ Lỗi khi tìm kiếm!");
//     } else {
//       res.render("search", { products: results, searched: true });
//     }
//   });
// });


// // 🚀 Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server đang chạy tại http://0.0.0.0:${PORT}`);
// });
import express from "express";
import dotenv from "dotenv";
import pool from "./db.js";
import path from "path";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// 🏠 Trang chủ
app.get("/", (req, res) => {
  res.render("index", { success: req.query.success, error: req.query.error });
});


// ➕ Thêm sản phẩm
app.post("/add", async (req, res) => {
  try {
    const { name, price } = req.body;
    await pool.query("INSERT INTO products (name, price) VALUES (?, ?)", [
      name,
      price,
    ]);
    res.redirect("/products?success=1");
  } catch (err) {
    console.error("❌ Lỗi khi thêm sản phẩm:", err);
    res.redirect("/?error=1");
  }
});


// 📋 Danh sách sản phẩm
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.render("products", { products: rows, success: req.query.success });
  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách:", err);
    res.render("products", { products: [], success: 0 });
  }
});


// 🗑️ Xóa sản phẩm
app.post("/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM products"
    );

    if (total === 0) {
      await pool.query("ALTER TABLE products AUTO_INCREMENT = 1");
      console.log("🔄 Reset ID về 1");
    }

    res.redirect("/products?success=1");
  } catch (err) {
    console.error("❌ Lỗi khi xóa:", err);
    res.redirect("/products?error=1");
  }
});


// ✏️ Form sửa
app.get("/edit/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) return res.send("❌ Không tìm thấy sản phẩm!");

    res.render("edit", { product: rows[0] });
  } catch (err) {
    res.send("❌ Lỗi load dữ liệu!");
  }
});


// ✏️ Cập nhật
app.post("/edit/:id", async (req, res) => {
  try {
    const { name, price } = req.body;

    await pool.query(
      "UPDATE products SET name=?, price=? WHERE id=?",
      [name, price, req.params.id]
    );

    res.redirect("/products?success=1");
  } catch (err) {
    console.error("❌ Lỗi cập nhật:", err);
    res.send("❌ Lỗi cập nhật!");
  }
});


// 🔍 Tìm kiếm
app.get("/search", async (req, res) => {
  if (!req.query.keyword)
    return res.render("search", { products: [], searched: false });

  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE name LIKE ?",
      [`%${req.query.keyword}%`]
    );

    res.render("search", { products: rows, searched: true });
  } catch (err) {
    console.error("❌ Lỗi tìm kiếm:", err);
    res.send("❌ Lỗi tìm kiếm!");
  }
});


// 🚀 Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server chạy tại ${PORT}`);
});
