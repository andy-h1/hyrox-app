import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/dashboard">Dashboard</Link>
          <Link
            className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
            href="/api/auth/signin?provider=google&callbackUrl=%2Fdashboard"
          >
            Sign in with Google
          </Link>
        </div>
      </main>
    </div>
  );
}
