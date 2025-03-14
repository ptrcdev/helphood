import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.NEXT_TWILO_ACCOUNT_SID;
const authToken = process.env.NEXT_TWILO_AUTH_TOKEN;
const fromPhone = process.env.NEXT_TWILO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

async function handler(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
  }
  
  const { to, message } = await req.json();
  

  try {
    console.log("SMS sending request:", { to, message });
    const response = await client.messages.create({
      body: message,
      from: fromPhone,
      to,
    });
    return NextResponse.json({ success: true, sid: response.sid });
  } catch (error) {
    console.error("SMS sending error:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}

export { handler as POST };