// resend-test.ts
import 'dotenv/config';
import { Resend } from 'resend';

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY in .env');
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: 'login@pandy.dev',
    to: 'a.huynh2612@gmail.com',
    subject: 'Magic link test (pandy.dev)',
    html: '<p>This is a test from Resend + Node.</p>',
    text: 'This is a test from Resend + Node.',
  });

  if (error) {
    console.error('Send error:', error);
    process.exit(1);
  }

  console.log('Email queued:', data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
