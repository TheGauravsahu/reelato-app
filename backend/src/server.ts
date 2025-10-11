import app from "./app";
import connectDB from "./config/db";
import config from "./config";

connectDB().catch((error) => {
  console.error("Failed to connect to DB:", error);
});

if (process.env.NODE_ENV === "development") {
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
}
