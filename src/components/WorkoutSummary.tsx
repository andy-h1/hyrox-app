import { getLoggedWorkouts } from '@/lib/database/workouts';
import { formatDate } from '@/utils/formatDate';

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
  console.log(loggedWorkouts);

  return (
    <div>
      <h1>Activity</h1>
      <p>Your workouts this week:</p>

      {loggedWorkouts.map((workout) => (
        <div key={workout.id}>
          <p>{formatDate(workout.date)}</p>
          <p>{workout.type === 'FOR_TRAINING' ? 'Training session' : 'Hyrox simulation'}</p>
          <p>Total workout duration: {workout.totalDuration}</p>

          <h3>Exercises done:</h3>
          {workout.exercises.map((exercise) => (
            <div key={exercise.workoutId}>
              <p>Exercise: {exercise.timeTaken / 60}</p>
              <p>Order of workout:{exercise.orderInWorkout}</p>
            </div>
          ))}
          <p>{workout.exercises[0].orderInWorkout}</p>
        </div>
      ))}
    </div>
  );
};
