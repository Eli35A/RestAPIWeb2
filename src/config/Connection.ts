import mongoose from "mongoose";

export const connectDb = async (mongoUrl: string) => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUrl);

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  console.log("Connected to MongoDB");
}
