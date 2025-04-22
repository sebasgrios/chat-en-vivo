const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  socketId: { type: String, required: true },
  username: { type: String, required: true },
  connectedAt: { type: Date, default: Date.now }
});

const Connection = mongoose.model("Connection", connectionSchema);

module.exports = Connection;