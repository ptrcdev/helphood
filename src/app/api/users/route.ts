import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("hoodhelp");
        const user = await db.collection("users").findOne({ });
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user." }, { status: 500 });
    }
}
