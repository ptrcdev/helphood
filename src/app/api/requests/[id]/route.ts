import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
      const { status } = await req.json();
      const url = req.nextUrl;
      const id = url.pathname.split('/').pop();
      const client = await clientPromise;
      const db = client.db("hoodhelp");
      if (id) {
        await db.collection("requests").updateOne({ _id: new ObjectId(id) }, { $set: { status } });
        return NextResponse.json({ message: "Request updated successfully." }, { status: 200 });
      } else {
        return NextResponse.json({ error: "Missing id in request." }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Failed to update request." }, { status: 500 });
    }
  }