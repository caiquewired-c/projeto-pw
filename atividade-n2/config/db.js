const { MongoClient } = require('mongodb');
const MONGO_URI = 'mongodb://caiqueaguiar07_db_user:EjJjyrRDADU2bIAj@ac-wuwontb-shard-00-00.olwshyq.mongodb.net:27017,ac-wuwontb-shard-00-01.olwshyq.mongodb.net:27017,ac-wuwontb-shard-00-02.olwshyq.mongodb.net:27017/?ssl=true&replicaSet=atlas-a5dhs6-shard-0&authSource=admin';
let db = null;
async function conectarBanco() {
  if (db) return db;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log('Conectado ao MongoDB!');
  db = client.db('forum_pw');
  return db;
}
module.exports = { conectarBanco };
