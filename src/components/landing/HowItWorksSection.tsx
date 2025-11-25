const steps = [
  {
    title: 'Sign Up',
    description: 'Create your free account in seconds with Google or email.',
    gradient: 'from-blue-400 to-blue-600 dark:from-blue-900 dark:to-blue-950',
  },
  {
    title: 'Log Your Workouts',
    description:
      'Use prepopulated Hyrox templates or create custom training sessions with our stopwatch system.',
    gradient: 'from-amber-400 to-amber-600 dark:from-amber-900 dark:to-amber-950',
  },
  {
    title: 'Compete & Improve',
    description:
      'Join weekly challenges, track your progress on the leaderboard, and watch your performance soar.',
    gradient: 'from-emerald-400 to-emerald-600 dark:from-emerald-900 dark:to-emerald-950',
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
            <div key={step.title} className="relative h-full">
              <div
                className={`flex h-full flex-col rounded-lg bg-gradient-to-br p-8 transition hover:shadow-lg ${step.gradient}`}
              >
                <div className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-lg font-semibold text-white backdrop-blur-sm">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/90">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
