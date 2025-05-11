import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function POST(req) {
  try {
    const body = await req.json();
    await client.connect();
    const db = client.db("events-platform");
    const users = db.collection("users");
    // Save all user data, including firebaseUid
    await users.insertOne(body);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
