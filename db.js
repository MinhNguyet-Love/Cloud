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
// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql.railway.internal",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Kiểm tra kết nối
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL pool connected!");
    conn.release();
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL Pool:", err);
  }
})();

export default pool;
