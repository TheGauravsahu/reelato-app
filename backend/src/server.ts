import app from "./app";
import connectDB from "./config/db";
import config from "./config";

async function startServer() {
  try {
    await connectDB(); // connect first
    
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
