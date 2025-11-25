import { ClockIcon } from '@heroicons/react/24/outline';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="rounded-lg bg-blue-600 p-2 dark:bg-blue-500">
        <ClockIcon className="h-6 w-6 text-white" />
      </div>
    </div>
  );
}
