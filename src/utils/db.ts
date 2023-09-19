import mysql from "mysql";
import { FileLogger } from "../utils/logger";
import * as dotenv from "dotenv";

dotenv.config();

const logger = new FileLogger("../logs");

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 3306,
  connectionLimit: 100,
});

export const testConnection = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        logger.log(`Database connection failed: ${err}`);
        console.error("Database connection failed: ", err);
        reject(false);
      } else {
        logger.log(`Database connected!`);
        console.log("Database connected!");
        connection.release();
        resolve(true);
      }
    });
  });
};

export default pool;
