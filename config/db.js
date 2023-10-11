const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");

const { MONGO_URI, MONGO_DB } = process.env;

let db;
const client = new MongoClient(MONGO_URI);

async function connectDB() {
  try {
    await client.connect();
    db = client.db(MONGO_DB);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database connection not initialized.");
  }
  return db;
}

function getClient() {
  if (!client) {
    throw new Error("Database connection not initialized.");
  }
  return client;
}

module.exports = {
  connectDB,
  getDB,
  getClient,
};
