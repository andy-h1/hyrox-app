import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { getLoggedWorkouts } from '@/lib/database/workouts';
import ActivitiesClient from './ActivitiesClient';

export const revalidate = 0;

export default async function ActivitiesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const workouts = await getLoggedWorkouts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            My Activities
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Your complete workout history
          </p>
        </div>

        <ActivitiesClient workouts={workouts} />
      </div>
    </div>
  );
}
