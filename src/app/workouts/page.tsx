import { getWorkoutTemplates } from '@/lib/database/workouts';
import { WorkoutTemplateGrid } from './WorkoutTemplateGrid';

export default async function WorkoutsPage() {
  const workoutTemplates = await getWorkoutTemplates();

  return (
    <div className="flex h-full flex-col border-2 border-red-500 p-6">
      <WorkoutTemplateGrid initialTemplate={workoutTemplates} />
    </div>
  );
}
