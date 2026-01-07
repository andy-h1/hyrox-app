import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { getExercisesList } from '@/lib/database/exercises';
import ExercisesClient from './ExercisesClient';

export const revalidate = 0;

export default async function ExercisesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const exercises = await getExercisesList();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Exercises
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Browse all available exercises by category
          </p>
        </div>

        <ExercisesClient exercises={exercises} />
      </div>
    </div>
  );
}
