import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Fetch all active volunteers
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hoodhelp");
    const volunteers = await db.collection("volunteers").find({availability: true}).toArray();
    return NextResponse.json({ volunteers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch active volunteers." }, { status: 500 });
  }
}