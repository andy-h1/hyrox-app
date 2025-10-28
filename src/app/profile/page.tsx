import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  console.log({ user });

  if (!user) redirect('/api/auth/signin');

  const profile = user.profile;

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Your Profile</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Account</h2>
        <div className="space-y-1 rounded border p-4">
          <p>
            <span className="font-semibold">Name:</span> {user?.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user?.email}
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
            <p>No profile yet. You&apos;ll be able to create one here soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}
