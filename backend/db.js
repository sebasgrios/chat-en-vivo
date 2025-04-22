const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://root:example@mongodb:27017/chat?authSource=admin", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB", error)
  }
}

module.exports = connectDB;