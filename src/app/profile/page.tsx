import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  let appUser = await prisma.appUser.findFirst({
    where: { authUserId: session.user.id },
    include: { profile: true },
  });

  if (!appUser) {
    appUser = await prisma.appUser.create({
      data: {
        email: session.user.email ?? `user-${session.user.id}@example.local`,
        name: session.user.name ?? 'New User',
        authUserId: session.user.id,
      },
      include: { profile: true },
    });
  }

  const { profile } = appUser;

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Your Profile</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Account</h2>
        <div className="space-y-1 rounded border p-4">
          <p>
            <span className="font-semibold">Name:</span> {appUser.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {appUser.email}
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Profile</h2>
        {profile ? (
          <div className="space-y-2 rounded border p-4">
            {profile.avatarUrl && (
              <Image
                src={profile.avatarUrl}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover"
                width={96}
                height={96}
              />
            )}
            <p>
              <span className="font-semibold">Bio:</span> {profile.bio ?? '—'}
            </p>
            <p>
              <span className="font-semibold">Height (cm):</span> {profile.height ?? '—'}
            </p>
            <p>
              <span className="font-semibold">Weight (kg):</span>{' '}
              {profile.weight ? String(profile.weight) : '—'}
            </p>
          </div>
        ) : (
          <div className="rounded border p-4">
            <p>No profile yet. You’ll be able to create one here soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}
