import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    console.log("Starting server...");

    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Startup error:", error);
    // ❌ DO NOT crash immediately (for debugging)
  }
};

startServer();