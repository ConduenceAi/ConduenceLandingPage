import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const NOREPLY_FROM = "CONDUENCE <noreply@conduence.xyz>";

const FORWARDING_RULES: Record<string, string> = {
  "anjali@conduence.xyz": "anjalijha2k3@gmail.com",
  "sarthak@conduence.xyz": "dengresarthak2002@gmail.com",
};

type ResendWebhookEvent = {
  type: string;
  data: {
    email_id: string;
    to?: string[];
  };
};

function normalizeAddress(address: string) {
  const match = address.match(/<([^>]+)>/);
  return (match?.[1] ?? address).trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const payload = await request.text();
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  let event: ResendWebhookEvent;

  if (webhookSecret) {
    try {
      event = resend.webhooks.verify({
        payload,
        headers: {
          id: request.headers.get("svix-id") ?? "",
          timestamp: request.headers.get("svix-timestamp") ?? "",
          signature: request.headers.get("svix-signature") ?? "",
        },
        webhookSecret,
      }) as ResendWebhookEvent;
    } catch (error) {
      console.error("Resend webhook verification failed", error);
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }
  } else {
    event = JSON.parse(payload) as ResendWebhookEvent;
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true });
  }

  const recipients = event.data.to ?? [];
  const forwardTargets = new Set<string>();

  for (const recipient of recipients) {
    const forwardTo = FORWARDING_RULES[normalizeAddress(recipient)];
    if (forwardTo) {
      forwardTargets.add(forwardTo);
    }
  }

  if (forwardTargets.size === 0) {
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const { data: receivedEmail, error: receiveError } = await resend.emails.receiving.get(
      event.data.email_id,
    );

    if (receiveError || !receivedEmail) {
      throw new Error(receiveError?.message ?? "Unable to load received email.");
    }

    const html =
      receivedEmail.html ??
      (receivedEmail.text ? `<pre>${receivedEmail.text}</pre>` : "<p>(no content)</p>");
    const text = receivedEmail.text ?? receivedEmail.html ?? "(no content)";

    await Promise.all(
      [...forwardTargets].map((to) =>
        resend.emails.send({
          from: NOREPLY_FROM,
          to,
          subject: receivedEmail.subject ? `Fwd: ${receivedEmail.subject}` : "Forwarded email",
          html,
          text,
          replyTo: receivedEmail.from,
        }),
      ),
    );

    return NextResponse.json({ ok: true, forwarded: true });
  } catch (error) {
    console.error("Inbound email forwarding failed", error);
    return NextResponse.json({ error: "Unable to forward email." }, { status: 502 });
  }
}
