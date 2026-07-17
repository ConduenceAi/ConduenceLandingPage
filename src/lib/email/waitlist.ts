const BODY_FONT_SIZE = "14px";
const BODY_LINE_HEIGHT = "1.5";
const SECONDARY_FONT_SIZE = "12px";

function personalEmailShell(content: string, preheader: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Conduence</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #ffffff;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
      ${preheader}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: 20px; font-family: Arial, Helvetica, sans-serif; color: #111111; font-size: ${BODY_FONT_SIZE}; line-height: ${BODY_LINE_HEIGHT};">
          ${content}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function paragraph(content: string, margin = "0 0 16px") {
  return `<p style="margin: ${margin}; font-size: ${BODY_FONT_SIZE}; line-height: ${BODY_LINE_HEIGHT};">${content}</p>`;
}

export function buildWaitlistWelcomeEmail() {
  const text = `Hey,

My name is Sarthak. I'm building Conduence.

We started Conduence because we wanted a better way to trade prediction markets with AI agents.
A platform where traders can orchestrate AI agents that learn their perspective and mirror their reasoning.

P.S.: Why did you sign up? What brought you here?

Hit "Reply" and let me know. I read and reply to every email.

Cheers,
Sarthak`;

  const html = personalEmailShell(
    `
      ${paragraph("Hey,")}
      ${paragraph("My name is Sarthak. I'm building Conduence.")}
      ${paragraph(
        `We started Conduence because we wanted a better way to trade prediction markets with AI agents.<br />
        A platform where traders can orchestrate AI agents that learn their perspective and mirror their reasoning.`,
      )}
      ${paragraph("<strong>P.S.: Why did you sign up? What brought you here?</strong>")}
      ${paragraph('Hit "Reply" and let me know. I read and reply to every email.')}
      <p style="margin: 0; font-size: ${BODY_FONT_SIZE}; line-height: ${BODY_LINE_HEIGHT};">
        Cheers,<br />
        Sarthak
      </p>
    `,
    "Welcome to Conduence. You're on the waitlist.",
  );

  return { html, text };
}

export function buildWaitlistNotificationEmail(email: string) {
  const safeEmail = email.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const text = `New waitlist signup

Email: ${email}

Conduence waitlist notification`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="margin: 0; padding: 20px; font-family: Arial, Helvetica, sans-serif; color: #111111; font-size: ${BODY_FONT_SIZE}; line-height: ${BODY_LINE_HEIGHT};">
    <h1 style="font-size: 18px; margin: 0 0 12px; font-weight: 600;">New waitlist signup</h1>
    <p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
    <p style="margin: 16px 0 0; font-size: ${SECONDARY_FONT_SIZE}; color: #666666;">Conduence waitlist notification</p>
  </body>
</html>`;

  return { html, text };
}
