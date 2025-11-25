import { Button } from '@/components/tailwind/button';
import { Logo } from './Logo';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-950/10 bg-white/80 backdrop-blur-lg dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-semibold text-zinc-950 dark:text-white">Hyrox Tracker</span>
        </div>
        <div className="flex items-center gap-3">
          <Button outline href="/login" className="hidden sm:inline-flex">
            Login
          </Button>
          <Button color="blue" href="/login">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
