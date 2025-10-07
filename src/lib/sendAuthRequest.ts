import { Resend } from 'resend';
import MagicLinkEmail from '@/emails/MagicLinkEmail';

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function sendVerificationRequest({
  identifier: to,
  url,
  provider,
}: {
  identifier: string;
  url: string;
  provider: { apiKey?: string; from?: string };
}) {
  if (!provider.from) throw new Error('Missing from');

  const host = new URL(url).host;
  const allowedHosts =
    process.env.NODE_ENV === 'development' ? ['localhost:3000'] : ['pandy.dev', 'www.pandy.dev'];
  if (!allowedHosts.includes(host))
    throw new Error(`Blocked verification link to untrusted host: ${host}`);

  const text = `Sign in to ${host}\n\n${url}\n\nIf you did not request this, ignore this email.`;

  const { error } = await resend.emails.send({
    from: provider.from,
    to,
    subject: `Sign in to ${host}`,
    react: MagicLinkEmail({ url }),
    text,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
}
