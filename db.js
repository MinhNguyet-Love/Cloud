// import mysql from "mysql2";
// import dotenv from "dotenv";

// dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   waitForConnections: true,
//   connectionLimit: 10
// });

// export default pool.promise();
// db.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Tạo Pool (production Railway bắt buộc dùng)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test pool
pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL Pool:", err);
  } else {
    console.log("✅ MySQL Pool hoạt động!");
    conn.release();
  }
});

export default pool;
