import { getLoggedWorkouts } from '@/lib/database/workouts';
import { ClockIcon, FireIcon } from '@heroicons/react/24/outline';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const WorkoutSummary = async () => {
  const loggedWorkouts = await getLoggedWorkouts();

  if (loggedWorkouts.length === 0) {
    return (
      <div className="text-center text-zinc-600 dark:text-zinc-400">
        <p>No workouts logged yet. Time to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loggedWorkouts.map((workout) => (
        <div
          key={workout.id}
          className="rounded-lg border border-zinc-950/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-zinc-900/50"
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-zinc-950 dark:text-white">
                {workout.template?.name || 'Workout'}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {new Date(workout.completedAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {workout.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <ClockIcon className="h-4 w-4" />
              <span>{formatDuration(workout.totalDuration)}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <FireIcon className="h-4 w-4" />
              <span>{workout.roundsCompleted} rounds</span>
            </div>
          </div>

          {workout.template?.exercises && workout.template.exercises.length > 0 && (
            <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Exercises:
              </p>
              <div className="flex flex-wrap gap-2">
                {workout.template.exercises.slice(0, 4).map((exercise) => (
                  <span
                    key={exercise.id}
                    className="rounded bg-zinc-200 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {exercise.exercise.name}
                  </span>
                ))}
                {workout.template.exercises.length > 4 && (
                  <span className="rounded bg-zinc-200 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    +{workout.template.exercises.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
