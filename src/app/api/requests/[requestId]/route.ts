import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const requestId = url.pathname.split('/').pop();
    const client = await clientPromise;
    const db = client.db("hoodhelp");

    if (requestId) {
      const request = await db.collection("requests").findOne({ _id: new ObjectId(requestId) });
      return NextResponse.json(request, { status: 200 });
    } else {
      return NextResponse.json({ error: "Missing requestId in request." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve request." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const requestId = url.pathname.split('/').pop();
    const client = await clientPromise;
    const db = client.db("hoodhelp");
    const body = await req.json();
    const { status, userId } = body;

    if (requestId) {
      if (userId) {
        const request = await db.collection("requests").updateOne({ _id: new ObjectId(requestId) }, { $set: { status, acceptedBy: userId } });
        return NextResponse.json(request, { status: 200 });
      } else {
        if (status === "cancelled") {
          const request = await db.collection("requests").updateOne({ _id: new ObjectId(requestId) }, { $set: { status }, $unset: { acceptedBy: "" } });
          return NextResponse.json(request, { status: 200 });
        }

        const request = await db.collection("requests").updateOne({ _id: new ObjectId(requestId) }, { $set: { status } });
        return NextResponse.json(request, { status: 200 });

      }
    } else {
      return NextResponse.json({ error: "Missing requestId in request." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve request." }, { status: 500 });
  }
}