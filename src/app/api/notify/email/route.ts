import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
  }
  
  const { to, subject, text, html } = await req.json();
  
  // Create a transporter using Gmail SMTP
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_GMAIL_USER, // Your Gmail address
      pass: process.env.NEXT_GMAIL_PASS, // Your App Password (or your Gmail password if 2FA is not enabled)
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.NEXT_GMAIL_USER, // sender address
      to, // list of receivers
      subject, // subject line
      text, // plain text body
      html, // html body (optional)
    });
    return NextResponse.json({ success: true, info });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
