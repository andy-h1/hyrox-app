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
          className="border-2 border-slate-300 p-8 border-solid rounded-md"
        >
          <DisclosureButton className="group flex flex-col w-full items-center justify-between">
            <p>{workout.type === 'FOR_TRAINING' ? 'Training session' : 'Hyrox simulation'}</p>
            <span className="pr-2 text-sm text-gray-500 dark:text-white mb-2">
              {formatDate(workout.date)}
            </span>
            <ChevronDownIcon className="size-5 fill-neutral-700 group-data-hover:fill-neutral/700 dark:fill-white/60 dark:group-data-hover:fill-white/50 group-data-open:rotate-180" />
          </DisclosureButton>

          {workout.exercises.map((exercise) => (
            <DisclosurePanel
              key={`${exercise.id}-${exercise.orderInWorkout}`}
              className="mt-2 text-sm/5 text-slate-800 dark:text-white/50"
            >
              <div
                aria-hidden="true"
                className="w-full border-t border-gray-300 dark:border-white/15 mt-4"
              >
                <span className="flex justify-between mt-2">
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
