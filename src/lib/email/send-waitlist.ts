import { Resend } from "resend";

import { buildWaitlistNotificationEmail, buildWaitlistWelcomeEmail } from "@/lib/email/waitlist";

const NOREPLY_FROM = "Conduence <noreply@conduence.xyz>";
const SARTHAK_FROM = "Sarthak <sarthak@conduence.xyz>";
const CONTACT_EMAIL = "Conduence <contact@conduence.xyz>";
const TEAM_NOTIFICATION_RECIPIENTS = ["anjalijha2k3@gmail.com", "dengresarthak2002@gmail.com"];

export async function sendWaitlistEmails(email: string, apiKey: string) {
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
}
