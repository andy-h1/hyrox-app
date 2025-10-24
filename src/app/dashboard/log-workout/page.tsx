import { WorkoutLogger } from '@/components/WorkoutLogger';
import { WorkoutWizard } from '@/components/WorkoutWizard';
import { getExercisesList } from '@/lib/database/exercises';
import { getWorkoutTemplates } from '@/lib/database/workouts';

export default async function LogWorkoutForm() {
  const exerciseList = await getExercisesList();
  const workoutTemplates = await getWorkoutTemplates();

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <h1>Let&apos;s get it! Choose your workout from the list below</h1>
        <WorkoutLogger templates={workoutTemplates} />
        {/* <WorkoutWizard exerciseList={exerciseList} /> */}
      </main>
    </div>
  );
}
