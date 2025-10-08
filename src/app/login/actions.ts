'use server';

import { z } from 'zod';
import { signIn } from '@/auth';

const EmailSchema = z.object({
  email: z.email(),
});

export async function sendMagicLink(formData: FormData) {
  const email = (formData.get('email') || '') as string;

  const parsed = EmailSchema.safeParse({ email });
  if (!parsed.success) {
    return { ok: false, error: 'Invalid email' };
  }

  try {
    const result = await signIn('resend', { email, redirect: false });
    console.log({ result });
    if (result || result.ok) {
      console.log('result ok');
      return { ok: true };
    }

    console.log('result not ok');
    return { ok: false, error: result.error ?? 'Failed to send magic link' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return { ok: false, error: message };
  }
}
