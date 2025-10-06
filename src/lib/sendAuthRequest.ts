import MagicLinkEmail from '@/emails/MagicLinkEmail';

export async function sendVerificationRequest({
  identifier: to,
  url,
  provider,
}: {
  identifier: string;
  url: string;
  provider: { apiKey?: string; from?: string };
}) {
  const parsed = new URL(url);
  const host = parsed.host;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: provider.from,
      to,
      subject: `Sign in to ${host}`,
      // Resend renders JSX to HTML internally
      react: { type: MagicLinkEmail, props: { url } },
      text: `Sign in to ${host}\n${url}\n\nIf you did not request this, ignore this email.`,
    }),
  });

  if (!res.ok) {
    throw new Error('Resend error: ' + JSON.stringify(await res.json()));
  }
}
