import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Fetch all volunteers
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hoodhelp");
    const volunteers = await db.collection("volunteers").find({}).toArray();
    return NextResponse.json({ volunteers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch  volunteers." }, { status: 500 });
  }
}

// POST: Create a new volunteer account (availability set to true)
export async function POST(req: NextRequest) {
  try {
    const { userId, location: { lat, lng } } = await req.json();
    const newVolunteer = {
      userId,
      availability: true,
      createdAt: new Date(),
      location: {
        type: "Point",
        coordinates: [lat, lng]
      },
    };

    const client = await clientPromise;
    const db = client.db("hoodhelp");
    await db.collection("volunteers").insertOne(newVolunteer);

    return NextResponse.json(newVolunteer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create volunteer." }, { status: 500 });
  }
}
