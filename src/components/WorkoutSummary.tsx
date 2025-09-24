import { ExerciseList } from '@/context/WorkoutContext/types';
import { getLoggedWorkouts } from '@/lib/database/workouts';
import { formatDate } from '@/utils/formatDate';
import { Exercise, WorkoutExercise } from '@prisma/client';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

type WorkoutResponse = {
  id: string;
  date: Date;
  type: string;
  totalDuration: number;
  roundsCompleted: number;
  exercises: Array<{
    workoutId: string;
    exercise: string;
    value: number;
    timeTaken: number;
    orderInWorkout: number;
  }>;
};

export const WorkoutSummary = async () => {
  const loggedWorkouts = await getLoggedWorkouts();

  console.log({ loggedWorkouts });
  // TODO: time isn't calculated correctly

  const convertSecondsToMins = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${mins}mins ${seconds}secs`;
  };

  return (
    <div className="flex flex-col gap-8">
      <h1>Activity</h1>
      <p>Your workouts this week:</p>

      {loggedWorkouts.map((workout) => (
        <Disclosure
          as="div"
          key={workout.id}
          defaultOpen={false}
          className="rounded-md border-2 border-solid border-slate-300 p-8"
        >
          <DisclosureButton className="group flex w-full flex-col items-center justify-between">
            <p>{workout.type === 'FOR_TRAINING' ? 'Training session' : 'Hyrox simulation'}</p>
            <span className="mb-2 pr-2 text-sm text-gray-500 dark:text-white">
              {formatDate(workout.date)}
            </span>
            <ChevronDownIcon className="group-data-hover:fill-neutral/700 size-5 fill-neutral-700 group-data-open:rotate-180 dark:fill-white/60 dark:group-data-hover:fill-white/50" />
          </DisclosureButton>

          {workout.exercises.map((exercise) => (
            <DisclosurePanel
              key={`${exercise.id}-${exercise.orderInWorkout}`}
              className="mt-2 text-sm/5 text-slate-800 dark:text-white/50"
            >
              <div
                aria-hidden="true"
                className="mt-4 w-full border-t border-gray-300 dark:border-white/15"
              >
                <span className="mt-2 flex justify-between">
                  <p className="font-bold text-slate-800 dark:text-white/50">
                    {exercise.exercise.name}
                  </p>
                  <p className="text-xs text-neutral-700 dark:text-blue-500">
                    Order: {exercise.orderInWorkout}
                  </p>
                </span>

                <p>
                  {exercise.value} {exercise.exercise.unit}
                </p>

                {exercise.timeTaken && <p>{convertSecondsToMins(exercise.timeTaken)}</p>}
              </div>
            </DisclosurePanel>
          ))}
        </Disclosure>
      ))}
    </div>
  );
};
