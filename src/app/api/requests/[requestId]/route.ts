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