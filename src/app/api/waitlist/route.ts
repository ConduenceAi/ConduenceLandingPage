import { NextResponse } from "next/server";
import { Resend } from "resend";

import { buildWaitlistNotificationEmail, buildWaitlistWelcomeEmail } from "@/lib/email/waitlist";
import { validateEmailExists } from "@/lib/email/validate";

export const runtime = "nodejs";

const NOREPLY_FROM = "Conduence <noreply@conduence.xyz>";
const SARTHAK_FROM = "Sarthak <sarthak@conduence.xyz>";
const CONTACT_EMAIL = "Conduence <contact@conduence.xyz>";
const TEAM_NOTIFICATION_RECIPIENTS = ["anjalijha2k3@gmail.com", "dengresarthak2002@gmail.com"];

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

    const validation = await validateEmailExists(rawEmail);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const email = validation.email;
    const resend = new Resend(apiKey);
    const welcomeEmail = buildWaitlistWelcomeEmail();
    const notificationEmail = buildWaitlistNotificationEmail(email);

    await Promise.all([
      resend.emails.send({
        from: SARTHAK_FROM,
        to: email,
        replyTo: CONTACT_EMAIL,
        subject: "Welcome to Conduence!",
        html: welcomeEmail.html,
        text: welcomeEmail.text,
        headers: {
          "X-Entity-Ref-ID": `waitlist-welcome-${Date.now()}`,
        },
        tags: [{ name: "category", value: "waitlist-welcome" }],
      }),
      resend.emails.send({
        from: NOREPLY_FROM,
        to: TEAM_NOTIFICATION_RECIPIENTS,
        replyTo: email,
        subject: "New Conduence waitlist signup",
        html: notificationEmail.html,
        text: notificationEmail.text,
        tags: [{ name: "category", value: "waitlist-notification" }],
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist request failed", error);
    return NextResponse.json({ error: "Unable to join the waitlist right now." }, { status: 502 });
  }
}
