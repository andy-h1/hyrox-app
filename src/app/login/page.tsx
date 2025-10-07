'use client';

import { useState, useTransition } from 'react';
import { sendMagicLink } from './actions';

export default function LoginPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function action(formData: FormData) {
    setStatus('sending');
    setError(null);
    startTransition(async () => {
      const res = await sendMagicLink(formData);
      if (res.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
        setError(res.error ?? 'Something went wrong');
      }
    });
  }

  console.log({ status });

  return (
    <div className="mx-auto mt-16 max-w-md font-sans">
      <h1 className="mb-3 text-2xl font-bold">Sign in</h1>
      <p className="mb-4 text-sm text-gray-600">We’ll email you a magic link to sign in.</p>

      <form action={action} className="space-y-3">
        <input
          type="email"
          name="email"
          required
          placeholder="you@pandy.dev"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'sending' || isPending}
          className="w-full rounded-md border border-gray-900 bg-gray-900 px-3 py-2 font-semibold text-white disabled:opacity-70"
        >
          {status === 'sending' || isPending ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      {status === 'sent' && (
        <p className="mt-3 text-sm text-green-600">Check your inbox for the magic link.</p>
      )}
      {status === 'error' && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
