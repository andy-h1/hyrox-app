import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SignInButton, SignOutButton } from './AuthButtons';

export const NavBar = async () => {
  const session = await getServerSession(authOptions);

  const profilePic = session?.user?.image ?? '/blank-avatar.jpg';
  return (
    <div className="flex h-18 w-full flex-row items-center justify-between gap-4 border-2 border-white px-4 py-2">
      <Link href={'/dashboard'}>Dashboard</Link>
      <Link href={'/activities'}>Activity</Link>
      <Link href={'/exercises'}>Exercises</Link>
      <Link href={'/workouts'}>Workouts</Link>

      <div className="ml-auto flex items-center gap-3">
        {session ? (
          <>
            <Link href={'/dashboard'} aria-label="Go to dashboard">
              <Image
                src={profilePic}
                alt="Profile pic"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
                priority
              />
            </Link>
            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  );
};
