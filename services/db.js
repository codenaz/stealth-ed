const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://root:${process.env.MONGO_PASSWORD}@cluster0.rrutd.mongodb.net/?retryWrites=true&w=majority`;

let db;

const startDb  = async () => {
  const dbClient = new mongoClient(uri);
  await dbClient.connect();
  db = dbClient.db('stealth_ed');
  return db;
}

module.exports = {
  startDb
}