import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const { availability } = await req.json();
        const url = req.nextUrl;
        const userId = url.pathname.split('/').pop();
        const client = await clientPromise;
        const db = client.db("hoodhelp");
        if (userId) {
            await db.collection("volunteers").updateOne({ userId }, { $set: { availability } });
            return NextResponse.json({ message: "Availability updated successfully." }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Missing id in request." }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to update availability." }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.pathname.split('/').pop();
        console.log(userId);

        const client = await clientPromise;
        const db = client.db("hoodhelp");
        if (userId) {
            const volunteer = await db.collection("volunteers").findOne({ userId });
            return NextResponse.json(volunteer, { status: 200 });
        } else {
            return NextResponse.json({ error: "Missing id in request." }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to get volunteer." }, { status: 500 });
    }
}