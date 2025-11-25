import { Button } from '@/components/tailwind/button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-900 dark:to-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-landing.jpg"
          alt="Hyrox workout background"
          fill
          className="object-cover opacity-50"
          unoptimized
        />
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-32 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Train Smarter. Compete Harder.
          </span>
          <br />
          <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Master Hyrox.
          </span>
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
