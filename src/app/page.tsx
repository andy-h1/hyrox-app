import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { SignInButton } from '@/components/AuthButtons';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <SignInButton />
        </div>
      </main>
    </div>
  );
}
