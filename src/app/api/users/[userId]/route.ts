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

export async function DELETE(req: NextRequest) {
    try {
        const url = req.nextUrl;
        const id = url.pathname.split('/').pop();
        const client = await clientPromise;
        const db = client.db("hoodhelp");
        if (id) {
            const result = await db.collection("users").deleteOne({ userId: id });
            return NextResponse.json({ result });
        } else {
            return NextResponse.json({ error: "Missing id in request." }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const url = req.nextUrl;
        const id = url.pathname.split('/').pop();
        const client = await clientPromise;
        const db = client.db("hoodhelp");
        if (id) {
            const result = await db.collection("users").updateOne({ userId: id }, { $set: await req.json() });
            return NextResponse.json({ result });
        } else {
            return NextResponse.json({ error: "Missing id in request." }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
    }
}