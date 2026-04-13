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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const db = await connectDB();
    const collection = db.collection(COLLECTION);

    const payload = { ...req.body, savedAt: new Date() };

    await collection.replaceOne(
      { _id: 'school_portal_main' },
      { _id: 'school_portal_main', ...payload },
      { upsert: true }
    );

    res.status(200).json({ success: true, message: 'Saved to MongoDB' });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save', details: err.message });
  }
};
