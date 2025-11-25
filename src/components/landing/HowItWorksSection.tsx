import { Badge } from '@/components/tailwind/badge';

const steps = [
  {
    title: 'Sign Up',
    description: 'Create your free account in seconds with Google or email.',
  },
  {
    title: 'Log Your Workouts',
    description:
      'Use prepopulated Hyrox templates or create custom training sessions with our stopwatch system.',
  },
  {
    title: 'Compete & Improve',
    description:
      'Join weekly challenges, track your progress on the leaderboard, and watch your performance soar.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-zinc-50 py-16 sm:py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            Start tracking your Hyrox journey in three simple steps.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="rounded-lg bg-white p-8 dark:bg-zinc-800">
                <Badge color="blue" className="text-lg">
                  {index + 1}
                </Badge>
                <h3 className="mt-4 text-xl font-semibold text-zinc-950 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
