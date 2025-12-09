import { redirect } from 'next/navigation';
import { WorkoutSummaryClient } from '@/components/WorkoutSummary';
import { getLoggedWorkouts } from '@/lib/database/workouts';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { ClockIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/outline';

export const revalidate = 0;

function formatDateWithOrdinal(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);

  const ordinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${ordinal(day)} ${month} ${year}`;
}

export default async function Dashboard() {
  const user = await getCurrentUser();
  console.log({ user });

  if (!user) {
    redirect('/login');
  }

  // Get this week's challenge
  const now = new Date();
  const thisWeekChallenge = await prisma.challenge.findFirst({
    where: {
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: {
      targetExercise: true,
      results: {
        orderBy: { rank: 'asc' },
        take: 10,
        include: {
          user: true,
        },
      },
    },
  });

  // Get logged workouts for summary
  const loggedWorkouts = await getLoggedWorkouts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Welcome back, {user.name}
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Track your progress and compete with friends
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/log-workout"
            className="group flex items-center gap-4 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-6 transition hover:from-green-600 hover:to-emerald-700"
          >
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Log Workout</h3>
              <p className="text-sm text-white/90">Track your training</p>
            </div>
          </Link>

          <Link
            href="/activities"
            className="group flex items-center gap-4 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-6 transition hover:from-orange-600 hover:to-red-700"
          >
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <FireIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">My Activities</h3>
              <p className="text-sm text-white/90">View your history</p>
            </div>
          </Link>

          <Link
            href="/workouts"
            className="group flex items-center gap-4 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-6 transition hover:from-purple-600 hover:to-indigo-700"
          >
            <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <TrophyIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Workouts</h3>
              <p className="text-sm text-white/90">Browse templates</p>
            </div>
          </Link>
        </div>

        {/* This Week's Challenge */}
        {thisWeekChallenge && (
          <div className="mb-8">
            <div className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                  This Week&apos;s Challenge
                </h2>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {formatDateWithOrdinal(new Date(thisWeekChallenge.startDate))} -{' '}
                  {formatDateWithOrdinal(new Date(thisWeekChallenge.endDate))}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-950 dark:text-white">
                {thisWeekChallenge.name}
              </h3>
              {thisWeekChallenge.description && (
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {thisWeekChallenge.description}
                </p>
              )}

              {/* Leaderboard */}
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  Leaderboard
                </h4>
                <div className="space-y-2">
                  {thisWeekChallenge.results.map((result, index) => (
                    <div
                      key={result.id}
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        result.userId === user.id
                          ? 'bg-zinc-100 dark:bg-zinc-800'
                          : 'bg-zinc-50 dark:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            index === 0
                              ? 'bg-yellow-500 text-white'
                              : index === 1
                                ? 'bg-zinc-400 text-white'
                                : index === 2
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {result.rank || index + 1}
                        </span>
                        <span className="font-medium text-zinc-950 dark:text-white">
                          {result.user.name}
                          {result.userId === user.id && ' (You)'}
                        </span>
                      </div>
                      <span className="font-semibold text-zinc-950 dark:text-white">
                        {result.resultValue.toFixed(2)}s
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workout Summary */}
        <div className="rounded-lg border border-zinc-950/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-bold text-zinc-950 dark:text-white">Recent Activity</h2>
          <WorkoutSummaryClient workouts={loggedWorkouts} />
        </div>
      </div>
    </div>
  );
}
