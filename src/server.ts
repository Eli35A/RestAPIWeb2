import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDb } from "./config/Connection";

const port = Number(process.env.PORT ?? 3000);
const mongoUrl = process.env.MONGO_URL ?? '';

if (!mongoUrl) {
  console.error("Missing MONGO_URL in env");
  process.exit(1);
}

export const startServer = async () => {
  await connectDb(mongoUrl);

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
};

startServer().catch((err) => {
  console.error("Error starting server: ", err);
  process.exit(1);
});
