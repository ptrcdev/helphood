import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

const generateUserId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `user_${randomNum}`;
};

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      name,
      role = "requester", // Default role if not provided
      bio = "",
      address = "",
      phone = "",
      notifications = { email: true, sms: true },
      image = "",
    } = await request.json();

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hoodhelp");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);
    const userId = generateUserId();

    const newUser = {
      email,
      password: hashedPassword,
      name,
      userId,
      role,
      bio,
      address,
      phone,
      notifications,
      image,
    };

    await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      { message: "User created", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error signing up:", error);
    return NextResponse.json(
      { error: "Failed to sign up" },
      { status: 500 }
    );
  }
}
