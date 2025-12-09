'use client';

import { useState } from 'react';
import type { Lap } from './Stopwatch';

type WorkoutReviewProps = {
  laps: Lap[];
  onSave: (laps: Lap[]) => Promise<void>;
  onBack: () => void;
};

// Map exercise names to their available units
const exerciseUnitOptions: Record<string, string[]> = {
  // Cardio exercises
  SkiErg: ['meters', 'calories'],
  Bike: ['meters', 'calories'],
  Row: ['meters', 'calories'],
  Run: ['meters', 'km', 'miles'],
  'Sled Push': ['meters'],
  'Sled Pull': ['meters'],

  // Strength exercises
  Burpees: ['reps'],
  'Wall Balls': ['reps'],
  Lunges: ['reps'],
  'Farmers Carry': ['meters'],
  'Sandbag Carry': ['meters'],
};

const getUnitOptions = (exerciseName: string): string[] => {
  // Check for exact match first
  if (exerciseUnitOptions[exerciseName]) {
    return exerciseUnitOptions[exerciseName];
  }

  // Check for partial matches (case insensitive)
  const lowerName = exerciseName.toLowerCase();
  for (const [key, units] of Object.entries(exerciseUnitOptions)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return units;
    }
  }

  // Default options
  return ['reps', 'meters', 'km', 'miles', 'calories'];
};

export const WorkoutReview = ({ laps, onSave, onBack }: WorkoutReviewProps) => {
  const [editedLaps, setEditedLaps] = useState<Lap[]>(laps);
  const [expandedLapId, setExpandedLapId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const exerciseLaps = editedLaps.filter((l) => l.type === 'exercise');
  const totalTime = editedLaps.reduce((acc, lap) => acc + lap.duration, 0);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
  };

  const formatTimeShort = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleUpdateLap = (
    lapId: number,
    field: 'actualValue' | 'actualUnit',
    value: string | number,
  ) => {
    setEditedLaps((prev) =>
      prev.map((lap) =>
        lap.id === lapId
          ? {
              ...lap,
              [field]: field === 'actualValue' ? (value === '' ? 0 : Number(value)) : value,
            }
          : lap,
      ),
    );
  };

  const toggleExpanded = (lapId: number) => {
    setExpandedLapId(expandedLapId === lapId ? null : lapId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedLaps);
    } catch (error) {
      console.error('Error saving workout:', error);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex h-screen w-full flex-col">
      {/* Header - Full Width */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={onBack}
            className="mr-3 rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            disabled={isSaving}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 md:text-xl dark:text-white">
            Workout Summary
          </h1>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="space-y-4 p-4">
          {/* Overall Stats */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Great Work!</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTimeShort(totalTime)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Exercises</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {exerciseLaps.length}
                </p>
              </div>
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-3">
            {exerciseLaps.map((lap, index) => {
              const isExpanded = expandedLapId === lap.id;
              const unitOptions = getUnitOptions(lap.name || '');

              return (
                <div
                  key={lap.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                >
                  {/* Clickable Summary */}
                  <button
                    onClick={() => toggleExpanded(lap.id)}
                    className="w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            #{index + 1}
                          </span>
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                            {lap.name}
                          </h4>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-mono">{formatTime(lap.duration)}</span>
                          <span>•</span>
                          <span>
                            {lap.actualValue || lap.targetValue} {lap.actualUnit || lap.targetUnit}
                          </span>
                        </div>
                      </div>
                      <svg
                        className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded Edit Form */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Target
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lap.targetValue} {lap.targetUnit}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor={`actual-value-${lap.id}`}
                              className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                            >
                              Actual Value
                            </label>
                            <input
                              id={`actual-value-${lap.id}`}
                              type="number"
                              min="0"
                              step="any"
                              value={lap.actualValue ?? lap.targetValue ?? ''}
                              onChange={(e) =>
                                handleUpdateLap(lap.id, 'actualValue', e.target.value)
                              }
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`actual-unit-${lap.id}`}
                              className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                            >
                              Unit
                            </label>
                            <select
                              id={`actual-unit-${lap.id}`}
                              value={lap.actualUnit || lap.targetUnit || 'reps'}
                              onChange={(e) =>
                                handleUpdateLap(lap.id, 'actualUnit', e.target.value)
                              }
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                              {unitOptions.map((unit) => (
                                <option key={unit} value={unit}>
                                  {unit}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Save Button - Full Width */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <button
          className="w-full cursor-pointer rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-50 md:py-4 md:text-lg dark:bg-green-500 dark:hover:bg-green-400"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Workout'}
        </button>
      </div>
    </div>
  );
};
