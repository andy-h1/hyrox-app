import { ExerciseList } from '@/context/WorkoutContext/types';
import { getLoggedWorkouts } from '@/lib/database/workouts';
import { formatDate } from '@/utils/formatDate';
import { Exercise, WorkoutExercise } from '@prisma/client';

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

  return (
    <div className="flex flex-col gap-8">
      <h1>Activity</h1>
      <p>Your workouts this week:</p>

      {loggedWorkouts.map((workout) => (
        <div key={workout.id} className="border-2 border-slate-300 p-8 border-solid rounded-md">
          <p>{workout.type === 'FOR_TRAINING' ? 'Training session' : 'Hyrox simulation'}</p>
          <span className="bg-white pr-2 text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            {formatDate(workout.date)}
          </span>

          {workout.exercises.map((exercise) => (
            <div key={`${exercise.id}-${exercise.orderInWorkout}`}>
              <span className="flex justify-between">
                <p>{exercise.exercise.name}</p>
                <p>{exercise.exercise.category}</p>
              </span>
              <p>Order: {exercise.orderInWorkout}</p>
              <p>
                {exercise.value} {exercise.exercise.unit}
              </p>
              <p>Time: {exercise.timeTaken / 60}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
