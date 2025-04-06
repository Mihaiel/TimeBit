// db.js
import mysql from "mysql2";
import { config } from './env.js';

const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
});

// Attempt to connect (test)
connection.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to the MySQL database!");
});

export default connection;
