import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL Connected");

    connection.release();
  } catch (error) {
    console.error("Database Connection Failed");
    console.error(error);
  }
};
