import { Button } from '@/components/tailwind/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-900 dark:to-black">
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-32 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Train Smarter. Compete Harder.
          <br />
          Master Hyrox.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300 dark:text-zinc-400">
          Track your Hyrox workouts with precision. Prepopulated training plans, real-time stopwatch
          tracking, and weekly challenges to keep you accountable.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/login" color="white" className="text-lg">
            Get Started Free
          </Button>
          <Button href="#features" plain className="text-lg !text-white hover:!text-white/80">
            Learn More →
          </Button>
        </div>
      </div>
    </section>
  );
}
