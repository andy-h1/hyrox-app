import { CheckIcon } from '@heroicons/react/20/solid';

enum StepStatus {
  Current = 'current',
  Upcoming = 'upcoming',
  Complete = 'complete',
}

type ProgressBarProps = {
  steps: Step[];
  currentStep: number;
  goToStep: (stepIdx: number) => void;
};

type Step = {
  name: string;
};

type StepWithStatus = Step & { status: StepStatus };

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const getStepStatuses = (steps: Step[], currentStep: number): StepWithStatus[] => {
  return steps.map((step, idx) => ({
    ...step,
    status:
      idx < currentStep
        ? StepStatus.Complete
        : idx === currentStep
          ? StepStatus.Current
          : StepStatus.Upcoming,
  }));
};

export const ProgressBar = ({ steps, currentStep, goToStep }: ProgressBarProps) => {
  const stepStatuses = getStepStatuses(steps, currentStep);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {stepStatuses.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}
          >
            {step.status === StepStatus.Complete ? (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-indigo-600 dark:bg-indigo-500" />
                </div>
                <a
                  href="#"
                  className="relative flex size-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  <CheckIcon aria-hidden="true" className="size-5 text-white" />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : step.status === StepStatus.Current ? (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-white/15" />
                </div>
                <a
                  href="#"
                  aria-current="step"
                  className="relative flex size-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white dark:border-indigo-500 dark:bg-gray-900"
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500"
                  />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-white/15" />
                </div>
                <a
                  href="#"
                  className="group relative flex size-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400 dark:border-white/15 dark:bg-gray-900 dark:hover:border-white/25"
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-white/15"
                  />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
