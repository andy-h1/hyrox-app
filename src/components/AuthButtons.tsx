'use client';
import { signIn, signOut } from 'next-auth/react';

export const SignInButton = () => {
  return (
    <button
      className='dark:focus-visible:outline-teal-500" rounded-md bg-teal-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 dark:bg-teal-400 dark:shadow-none dark:hover:bg-teal-400'
      onClick={() => signIn()}
    >
      Sign in{' '}
    </button>
  );
};

export const SignOutButton = () => {
  return (
    <button
      className='dark:focus-visible:outline-teal-500" rounded-md bg-teal-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 dark:bg-teal-400 dark:shadow-none dark:hover:bg-teal-400'
      onClick={() => signOut()}
    >
      Sign out
    </button>
  );
};
