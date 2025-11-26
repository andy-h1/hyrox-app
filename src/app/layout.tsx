import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from './AuthProvider';
import { ConditionalNavBar } from '@/components/ConditionalNavBar';

export const metadata: Metadata = {
  title: 'Hyrox Tracker - Train Smarter, Compete Harder',
  description:
    'Track your Hyrox workouts with precision. Prepopulated training plans, stopwatch tracking, weekly challenges, and global leaderboards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="antialiased">
          <ConditionalNavBar />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
