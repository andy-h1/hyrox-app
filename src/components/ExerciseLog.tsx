import type { WorkoutTemplate } from '@/app/workouts/page';
import { Stopwatch } from './Stopwatch';
import type { Lap } from './Stopwatch';
import { saveWorkoutAction } from '@/app/dashboard/log-workout/actions';

enum format {
  'FOR_TIME' = 'For time',
  'AMRAP' = 'As many reps as possible',
  'EMOM' = 'Every minute on the minute',
}

export const ExerciseLog = ({ template }: { template: WorkoutTemplate }) => {
  const handleSaveWorkout = async (laps: Lap[]) => {
    const formData = new FormData();
    formData.append('templateId', template.id.toString());
    formData.append('laps', JSON.stringify(laps));
    formData.append('workoutStartTime', laps[0]?.startedAt.toISOString() || '');
    formData.append('workoutEndTime', laps[laps.length - 1]?.completedAt.toISOString() || '');

    await saveWorkoutAction(formData);
  };

  return (
    <div>
      <Stopwatch exercises={template.exercises} onSave={handleSaveWorkout} />
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
