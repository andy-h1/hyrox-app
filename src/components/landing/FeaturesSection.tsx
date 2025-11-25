const features = [
  {
    icon: '📅',
    title: 'Weekly Training Plans',
    description:
      'Access professionally designed Hyrox workout templates tailored for each week of your training cycle.',
    gradient: 'from-purple-400 to-pink-500 dark:from-purple-900 dark:to-pink-900',
  },
  {
    icon: '⏱️',
    title: 'Precision Timing',
    description:
      'Track station times and rest periods with our built-in stopwatch system for accurate performance metrics.',
    gradient: 'from-blue-400 to-cyan-500 dark:from-blue-900 dark:to-cyan-900',
  },
  {
    icon: '🏆',
    title: 'Compete with Friends',
    description: 'Join weekly challenges and push your limits alongside your training partners.',
    gradient: 'from-orange-400 to-red-500 dark:from-orange-900 dark:to-red-900',
  },
  {
    icon: '📊',
    title: 'Global Rankings',
    description:
      'See how you stack up against the community with our real-time leaderboard system.',
    gradient: 'from-green-400 to-emerald-500 dark:from-green-900 dark:to-emerald-900',
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-zinc-900" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
            Everything You Need to Excel
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            All the tools you need to track, analyze, and improve your Hyrox performance.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`rounded-lg bg-gradient-to-br p-6 transition hover:shadow-lg ${feature.gradient}`}
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-white/90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
