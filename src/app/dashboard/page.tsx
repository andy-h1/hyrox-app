import { WorkoutSummary } from '@/components/WorkoutSummary';
import Link from 'next/link';

export default async function Dashboard() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 text-center font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px]">
        <h1 className="text-center text-3xl">Dashboard</h1>
        <Link
          href="/dashboard/log-workout"
          type="button"
          className="w-full rounded-md bg-teal-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 dark:bg-teal-400 dark:shadow-none dark:hover:bg-teal-400 dark:focus-visible:outline-teal-500"
        >
          Log your workout
        </Link>
        <WorkoutSummary />
      </main>
    </div>
  );
}
