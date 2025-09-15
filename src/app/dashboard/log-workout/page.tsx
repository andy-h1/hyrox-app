import { WorkoutWizard } from '@/components/WorkoutWizard';
import { getExercisesList } from '@/lib/database/exercises';

export default async function LogWorkoutForm() {
  const exerciseList = await getExercisesList();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Let&apos;s get it! What workout are you doing today?</h1>
        <WorkoutWizard exercises={exerciseList} />
      </main>
    </div>
  );
}
