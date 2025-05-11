import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

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
    if (
      (body.logo && body.logo.length > 1_400_000) ||
      (body.banner && body.banner.length > 1_400_000)
    ) {
      return new Response(
        JSON.stringify({ success: false, error: "Image too large" }),
        { status: 400 }
      );
    }
    await client.connect();
    const db = client.db("events-platform");
    const events = db.collection("events");
    await events.insertOne(body);
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

export async function GET() {
  try {
    await client.connect();
    const db = client.db("events-platform");
    const events = db.collection("events");
    const allEvents = await events.find({}).sort({ createdAt: -1 }).toArray();
    return new Response(JSON.stringify({ events: allEvents }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
