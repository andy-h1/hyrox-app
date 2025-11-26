'use client';

import React, { useState } from 'react';
import { ClockIcon, FireIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type WorkoutLog = {
  id: number;
  userId: number;
  templateId: number | null;
  completedAt: Date;
  roundsCompleted: number;
  totalDuration: number;
  totalWorkTime: number;
  totalRestTime: number;
  status: string;
  notes: string | null;
  template: {
    id: number;
    name: string;
    targetRounds: number | null;
    exercises: Array<{
      id: number;
      targetValue: number;
      targetUnit: string;
      exercise: {
        id: number;
        name: string;
        category: string;
      };
    }>;
  } | null;
  rounds: Array<{
    id: number;
    roundNumber: number;
    duration: number;
    restAfter: number | null;
    exercises: Array<{
      id: number;
      duration: number;
      restAfter: number | null;
      actualValue: number;
      actualUnit: string;
      exercise: {
        id: number;
        name: string;
        category: string;
      };
    }>;
  }>;
};

type WorkoutSummaryClientProps = {
  workouts: WorkoutLog[];
};

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getCondensedExerciseDisplay(template: WorkoutLog['template']): string {
  if (!template?.exercises || template.exercises.length === 0) {
    return 'No exercises';
  }

  const exerciseNames = template.exercises.map((e) => e.exercise.name).join(', ');
  const rounds = template.targetRounds;

  if (rounds && rounds > 1) {
    return `${exerciseNames} - Complete ${rounds} rounds`;
  }
  return exerciseNames;
}

export const WorkoutSummaryClient = ({ workouts }: WorkoutSummaryClientProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (workouts.length === 0) {
    return (
      <div className="text-center text-zinc-600 dark:text-zinc-400">
        <p>No workouts logged yet. Time to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => {
        const isExpanded = expandedId === workout.id;

        return (
          <div
            key={workout.id}
            className="overflow-hidden rounded-lg border border-zinc-950/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/50"
          >
            {/* Clickable Summary */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : workout.id)}
              className="w-full p-4 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-950 dark:text-white">
                    {workout.template?.name || 'Workout'}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(workout.completedAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {workout.status}
                  </span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <ClockIcon className="h-4 w-4" />
                  <span>{formatDuration(workout.totalDuration)}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <FireIcon className="h-4 w-4" />
                  <span>{workout.roundsCompleted} rounds</span>
                </div>
              </div>

              {/* Condensed Exercise Display */}
              {workout.template && (
                <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {getCondensedExerciseDisplay(workout.template)}
                  </p>
                </div>
              )}
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="space-y-4">
                  {/* Round-by-round breakdown */}
                  {workout.rounds && workout.rounds.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-white">
                        Round Breakdown
                      </h4>
                      <div className="space-y-3">
                        {workout.rounds.map((round, idx) => (
                          <React.Fragment key={round.id}>
                            <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                  Round {round.roundNumber}
                                </span>
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                  {formatDuration(round.duration)}
                                </span>
                              </div>
                            {round.exercises && round.exercises.length > 0 && (
                              <div className="space-y-1 border-t border-zinc-200 pt-2 dark:border-zinc-700">
                                {round.exercises.map((ex) => (
                                  <div
                                    key={ex.id}
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <span className="text-zinc-700 dark:text-zinc-300">
                                      {ex.exercise.name}
                                    </span>
                                    <span className="text-zinc-500 dark:text-zinc-400">
                                      {formatDuration(ex.duration)} • {ex.actualValue} {ex.actualUnit}
                                      {ex.restAfter && (
                                        <span className="ml-1 text-orange-600 dark:text-orange-400">
                                          + {formatDuration(ex.restAfter)} rest
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                            </div>
                            {round.restAfter && idx < workout.rounds.length - 1 && (
                              <div className="flex items-center justify-center">
                                <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                  Rest: {formatDuration(round.restAfter)}
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Full exercise list */}
                  {workout.template?.exercises && workout.template.exercises.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-white">
                        Exercises
                      </h4>
                      <div className="space-y-2">
                        {workout.template.exercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            className="flex items-center justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800"
                          >
                            <span className="text-sm text-zinc-900 dark:text-white">
                              {exercise.exercise.name}
                            </span>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              {exercise.targetValue} {exercise.targetUnit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {workout.notes && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-white">
                        Notes
                      </h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{workout.notes}</p>
                    </div>
                  )}

                  {/* Additional Stats */}
                  <div className="grid grid-cols-2 gap-3 border-t border-zinc-200 pt-3 dark:border-zinc-700">
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Work Time</p>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {formatDuration(workout.totalWorkTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Rest Time</p>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {formatDuration(workout.totalRestTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
