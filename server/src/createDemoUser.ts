import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.js";

const createDemoUser = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: "demo@gymtracker.com" });

    if (existingUser) {
      console.log("Demo user already exists:");
      console.log("User ID:", existingUser._id);
      console.log("Name:", existingUser.name);
      console.log("Email:", existingUser.email);
      return;
    }

    // Create demo user with specific ID
    const demoUser = new User({
      _id: new mongoose.Types.ObjectId("673092a6fd2a34e8e4b91234"),
      name: "Demo User",
      email: "demo@gymtracker.com",
    });

    await demoUser.save();
    console.log("Demo user created successfully!");
    console.log("User ID:", demoUser._id);
    console.log("Name:", demoUser.name);
    console.log("Email:", demoUser.email);
  } catch (error) {
    console.error("Error creating demo user:", (error as Error).message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

createDemoUser();
