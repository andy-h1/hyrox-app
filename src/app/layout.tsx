import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from './AuthProvider';
import { NavBar } from '@/components/NavBar';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Hyrox Tracker - Train Smarter, Compete Harder',
  description:
    'Track your Hyrox workouts with precision. Prepopulated training plans, stopwatch tracking, weekly challenges, and global leaderboards.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  // Don't show NavBar on landing page
  const showNavBar = pathname !== '/';

  return (
    <AuthProvider>
      <html lang="en">
        <body className="antialiased">
          {showNavBar && <NavBar />}
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
