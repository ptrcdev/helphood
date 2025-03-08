import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

// POST: Create a new help request
export async function POST(req: NextRequest) {
  try {
    const { title, description, location: { lat, lng }, urgency, userId } = await req.json();
    const newRequest = {
      title,
      description,
      status: 'open',
      createdAt: new Date(),
      location: {
        type: "Point",
        coordinates: [lat, lng]
      },
      urgency,
      author: userId
    };

    const client = await clientPromise;
    const db = client.db("hoodhelp");
    await db.collection("requests").insertOne(newRequest);

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create help request." }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId"); // Get userId from query parameters
        const client = await clientPromise;
        const db = client.db("hoodhelp");
        
        if (userId) {
            const requests = await db.collection("requests").find({ author: userId }).toArray(); // Fetch requests for the userId
            return NextResponse.json(requests, { status: 200 });
        } else {
            const requests = await db.collection("requests").find({}).toArray();
            return NextResponse.json({ requests });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to retrieve requests." }, { status: 500 });
    }
}