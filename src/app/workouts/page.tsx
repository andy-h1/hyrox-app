import { getWorkoutTemplates } from '@/lib/database/workouts';
import { formatDate } from '@/utils/formatDate';

export default async function WorkoutsPage() {
  const workoutTemplates = await getWorkoutTemplates();
  console.log(workoutTemplates);

  // what do we need to build a new workout?
  // name of workout
  // exercises chosen
  // values of the exercises
  // choose different units - weight, distance,
  // save workout

  return (
    <div>
      <main>
        <button type="button">Add new workout</button>
        <h1>List of previous workouts</h1>
        {workoutTemplates.map((workout) => (
          <div key={workout.id} className="border border-white">
            <li>Workout date: {formatDate(workout.date)}</li>
            <li>{workout.type}</li>
            {workout.exercises.map((exercise) => (
              <div key={exercise.id}>
                <li>{exercise.name}</li>
                <li>{exercise.category}</li>
                <li>{exercise.unit}</li>
                <li>{exercise.orderInWorkout}</li>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}
