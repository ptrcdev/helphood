import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const { availability } = await req.json();
        const url = req.nextUrl;
        const id = url.pathname.split('/').pop();
        const client = await clientPromise;
        const db = client.db("hoodhelp");
        if (id) {
            await db.collection("volunteers").updateOne({ _id: new ObjectId(id) }, { $set: { availability } });
            return NextResponse.json({ message: "Availability updated successfully." }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Missing id in request." }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to update availability." }, { status: 500 });
    }
}
