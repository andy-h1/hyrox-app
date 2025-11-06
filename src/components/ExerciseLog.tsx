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

// TODO: When user clicks on workout we need to show the exercises they need to do
// the target distance/reps
// the target weight
// When user starts the workout it should start timer on the first exercise and show what exercise they are currently doing
// When user clicks finish workout it should log that workout and move to rest time
// When user clicks next exercise it should stop rest time and move to next exercise

// NOTE: Make a simpler workout to test
// Get the functionality working first before cleaning up the CSS
