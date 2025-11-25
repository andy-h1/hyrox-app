import { Button } from '@/components/tailwind/button';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-950/10 bg-white/80 backdrop-blur-lg dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-xl font-[800] text-zinc-950 italic dark:text-white">HT</span>
        </div>
        <div className="flex items-center gap-3">
          <Button outline href="/login" className="hidden sm:inline-flex">
            Login
          </Button>
          <Button color="zinc" href="/login">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
