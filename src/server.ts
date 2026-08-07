import app from "./app";
import { connectDatabase } from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server");

    process.exit(1);
  }
};

startServer();
