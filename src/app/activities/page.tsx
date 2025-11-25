import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { getLoggedWorkouts } from '@/lib/database/workouts';
import { ClockIcon, FireIcon, CalendarIcon } from '@heroicons/react/24/outline';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

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

        {workouts.length === 0 ? (
          <div className="rounded-lg border border-zinc-950/10 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-900">
            <CalendarIcon className="mx-auto h-12 w-12 text-zinc-400" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">
              No activities yet
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Start logging your workouts to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="rounded-lg border border-zinc-950/10 bg-white p-6 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                      {workout.template?.name || 'Workout'}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(workout.completedAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(workout.completedAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {workout.status}
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <ClockIcon className="h-5 w-5" />
                      <span className="text-xs">Duration</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
                      {formatDuration(workout.totalDuration)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <FireIcon className="h-5 w-5" />
                      <span className="text-xs">Rounds</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
                      {workout.roundsCompleted}
                    </p>
                  </div>

                  <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <ClockIcon className="h-5 w-5" />
                      <span className="text-xs">Work Time</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
                      {formatDuration(workout.totalWorkTime)}
                    </p>
                  </div>
                </div>

                {workout.template?.exercises && workout.template.exercises.length > 0 && (
                  <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                    <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Exercises
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {workout.template.exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-900/50"
                        >
                          <span className="text-sm text-zinc-950 dark:text-white">
                            {exercise.exercise.name}
                          </span>
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">
                            {exercise.targetValue} {exercise.targetUnit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {workout.notes && (
                  <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{workout.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
