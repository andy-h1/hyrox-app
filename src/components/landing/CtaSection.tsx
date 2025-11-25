import { Button } from '@/components/tailwind/button';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Elevate Your Hyrox Training?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100 dark:text-indigo-200">
          Join thousands of athletes tracking their way to better performance.
        </p>
        <div className="mt-8">
          <Button href="/login" color="white" className="text-lg">
            Start Training Today
          </Button>
        </div>
      </div>
    </section>
  );
}
