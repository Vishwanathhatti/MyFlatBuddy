import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MyFlatBuddy")
    console.log("Connected to MongoDB database successfully")
  } catch (error) {
    console.log("Error connecting MongoDB: ",error)
  }
};

export default connectDB
