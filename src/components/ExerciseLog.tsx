import type { WorkoutTemplate } from '@/app/workouts/page';
import { Stopwatch } from './Stopwatch';

export const ExerciseLog = ({ template }: { template: WorkoutTemplate }) => {
  const { id, name, description, format, exercises, creator, sharedWith, createdAt } = template;

  const exerciseName = exercises.map((ex) => ex.name);
  console.log({ exerciseName });
  return (
    <div>
      <h1>{description}</h1>
      <Stopwatch exercises={exercises} />
    </div>
  );
};
