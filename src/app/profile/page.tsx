import { getCurrentUser } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/ProfileForm';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  console.log({ user });

  if (!user) redirect('/api/auth/signin');

  const userForForm = {
    name: user.name ?? '',
    id: String(user.id),
  };

  const profileForForm = user.profile
    ? {
        bio: user.profile.bio,
        height: user.profile.height,
        weight: user.profile.weight ? user.profile.weight.toNumber() : null,
        avatarUrl: user.profile.avatarUrl,
      }
    : null;

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
        <ProfileForm user={userForForm} profile={profileForForm} />
      </section>
    </div>
  );
}
