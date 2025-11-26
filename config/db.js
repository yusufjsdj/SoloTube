import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("📦 MongoDB bağlandı");
  } catch (err) {
    console.log("MongoDB Hatası:", err);
  }
