'use client';

import { useState, useTransition } from 'react';
import { sendMagicLink } from './actions';
import { signIn } from 'next-auth/react';

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

  const handleGoogleLogin = () => {
    signIn('google', { redirectTo: '/dashboard' });
  };

  return (
    <div className="mx-auto mt-8 max-w-md px-4 py-12 pb-8 font-sans sm:mt-16 sm:px-6">
      <h1 className="mb-3 text-xl font-bold sm:text-2xl">Sign in</h1>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        We&apos;ll email you a magic link to sign in.
      </p>

      <form action={action} className="space-y-3">
        <input
          type="email"
          name="email"
          required
          placeholder="you@pandy.dev"
          className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-base ring-2 focus:ring-gray-900 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={status === 'sending' || isPending}
          className="w-full rounded-md border border-gray-900 bg-gray-900 px-3 py-2.5 font-semibold text-white transition-opacity hover:bg-gray-800 disabled:opacity-70 dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {status === 'sending' || isPending ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="rounded-2xl bg-white px-3 text-gray-500 dark:bg-black dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google button */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </span>
      </button>

      {status === 'sent' && (
        <p className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          Check your inbox for the magic link.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
