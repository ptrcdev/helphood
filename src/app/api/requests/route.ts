import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";


// GET: Fetch all help requests
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hoodhelp");
    const requests = await db.collection("requests").find({}).toArray();
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch help requests." }, { status: 500 });
  }
}

// POST: Create a new help request
export async function POST(req: NextRequest) {
  try {
    const { title, description, location: { lat, lng }, urgency } = await req.json();
    const newRequest = {
      title,
      description,
      status: 'open',
      createdAt: new Date(),
      location: {
        type: "Point",
        coordinates: [lat, lng]
      },
      urgency
    };

    const client = await clientPromise;
    const db = client.db("hoodhelp");
    await db.collection("requests").insertOne(newRequest);

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create help request." }, { status: 500 });
  }
}


