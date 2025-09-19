import { WorkoutWizard } from '@/components/WorkoutWizard';
import { getExercisesList } from '@/lib/database/exercises';

export default async function LogWorkoutForm() {
  const exerciseList = await getExercisesList();

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <h1>Let&apos;s get it! What workout are you doing today?</h1>
        <WorkoutWizard exerciseList={exerciseList} />
      </main>
    </div>
  );
}
