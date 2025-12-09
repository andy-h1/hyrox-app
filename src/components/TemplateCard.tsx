'use client';

import { useState } from 'react';
import { formatDate } from '@/utils/timeAndDateUtils';
import { WorkoutTemplate } from '@/app/(authenticated)/workouts/page';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

function getCondensedExerciseDisplay(template: WorkoutTemplate): string {
  if (!template.exercises || template.exercises.length === 0) {
    return 'No exercises';
  }

  const exerciseNames = template.exercises.map((e) => e.name).join(', ');
  const rounds = template.targetRounds;

  if (rounds && rounds > 1) {
    return `${exerciseNames} - Complete ${rounds} rounds`;
  }
  return exerciseNames;
}

export const TemplateCard = ({ template }: { template: WorkoutTemplate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { id, name, description, format, exercises, creator, sharedWith, createdAt, targetRounds } =
    template;

  return (
    <div
      key={id}
      className="overflow-hidden rounded-lg border border-zinc-950/10 bg-white dark:border-white/10 dark:bg-zinc-900"
    >
      {/* Clickable Summary */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">{name}</h2>
            {description && (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
            )}
          </div>
          <ChevronDownIcon
            className={`ml-2 h-5 w-5 flex-shrink-0 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Format badge */}
        <div className="mb-3">
          <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {format}
          </span>
          {targetRounds && targetRounds > 1 && (
            <span className="ml-2 inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
              {targetRounds} rounds
            </span>
          )}
        </div>

        {/* Condensed exercise display */}
        <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {getCondensedExerciseDisplay(template)}
          </p>
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="space-y-4">
            {/* Full exercise list */}
            {exercises.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-white">
                  Exercise Details
                </h4>
                <div className="space-y-2">
                  {exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded bg-white px-3 py-2 dark:bg-zinc-900"
                    >
                      <div>
                        <span className="font-medium text-zinc-950 dark:text-white">{ex.name}</span>
                        <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                          ({ex.category})
                        </span>
                      </div>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {ex.targetValue} {ex.targetUnit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer info */}
            <div className="border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              <p>Created by {creator.name}</p>
              <p>{formatDate(createdAt)}</p>
              {sharedWith.length > 0 && (
                <p className="mt-1">Shared with {sharedWith.length} people</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
