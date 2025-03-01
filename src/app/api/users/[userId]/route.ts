import clientPromise from "@/lib/mongodb";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = req.nextUrl;
        const id = url.pathname.split('/').pop();
        const client = await clientPromise;
        const db = client.db("hoodhelp");
        if (id) {
            const user = await db.collection("users").findOne({ userId: id });
            return NextResponse.json({ user });
        } else {
            return NextResponse.json({ error: "Missing id in request." }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user." }, { status: 500 });
    }
}
