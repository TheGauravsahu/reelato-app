import app from "./app";
import connectDB from "./config/db";
import config from "./config";

app.listen(config.PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${config.PORT}`);
});
