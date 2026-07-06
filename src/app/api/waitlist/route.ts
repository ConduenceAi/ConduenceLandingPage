import { NextResponse } from "next/server";

import { sendWaitlistEmails } from "@/lib/email/send-waitlist";
import { validateEmail } from "@/lib/email/validate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
    }

    let rawEmail = "";

    try {
      const body = (await request.json()) as { email?: unknown };
      rawEmail = typeof body.email === "string" ? body.email : "";
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const validation = validateEmail(rawEmail);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const email = validation.email;
    await sendWaitlistEmails(email, apiKey);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist request failed", error);
    return NextResponse.json({ error: "Unable to join the waitlist right now." }, { status: 502 });
  }
}
