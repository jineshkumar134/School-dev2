const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'school_planning';
const COLLECTION = 'portal_data';

let cachedClient = null;

async function connectDB() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI);
    await cachedClient.connect();
  }
  return cachedClient.db(DB_NAME);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await connectDB();
    const collection = db.collection(COLLECTION);

    const data = await collection.findOne({ _id: 'school_portal_main' });

    if (!data) {
      return res.status(200).json({ found: false, data: null });
    }

    res.status(200).json({ found: true, data });
  } catch (err) {
    console.error('Load error:', err);
    res.status(500).json({ error: 'Failed to load', details: err.message });
  }
};
