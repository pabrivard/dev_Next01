import { Resend } from "resend";
import { render } from "@react-email/render";
import type { ReactElement } from "react";

// Required env vars: RESEND_API_KEY, EMAIL_FROM
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  template: ReactElement;
}

export async function sendEmail({ to, subject, template }: SendEmailOptions): Promise<void> {
  const html = await render(template);
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "",
    to,
    subject,
    html,
  });
}
