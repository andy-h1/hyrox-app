import { getWorkoutTemplates } from '@/lib/database/workouts';
import { WorkoutTemplateGrid } from '../../components/WorkoutTemplateGrid';
import { getExercisesList } from '@/lib/database/exercises';

export type WorkoutTemplate = Awaited<ReturnType<typeof getWorkoutTemplates>>[0];
export type ExerciseList = Awaited<ReturnType<typeof getExercisesList>>[0];

export default async function WorkoutsPage() {
  const workoutTemplates = await getWorkoutTemplates();
  const exerciseList = await getExercisesList();

  return (
    <div className="flex h-full flex-col p-6">
      <WorkoutTemplateGrid initialTemplate={workoutTemplates} exerciseList={exerciseList} />
    </div>
  );
}
