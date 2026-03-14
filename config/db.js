const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to venetcta database on MongoDB Atlas
    let mongoUri = process.env.MONGODB_URI || "mongodb+srv://shaileshmitkari40:Shailesh@cluster0.jyajky2.mongodb.net/venetcta?retryWrites=true&w=majority";
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true
    });

    console.log("✅ MongoDB Connected:", conn.connection.host);
    console.log("✅ Database:", conn.connection.name);
    return true;

  } catch (error) {

    console.error("⚠️ MongoDB Connection Error:", error.message);
    console.log("📋 Server will continue running.");
    return false;

  }
};

module.exports = connectDB;
