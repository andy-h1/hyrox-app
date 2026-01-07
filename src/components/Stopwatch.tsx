'use client';

import { useState, useEffect, useRef } from 'react';
import { ConfirmationModal } from './ConfirmationModal';

//TODO: Move this type somewhere better than at the child component
export type Lap = {
  id: number;
  name: string;
  type: 'exercise' | 'rest' | 'finished';
  duration: number;
  exerciseId?: number;
  startedAt: Date;
  completedAt: Date;
  actualValue?: number;
  actualUnit?: string;
  targetValue?: number;
  targetUnit?: string;
};

export type ExerciseTarget = {
  id: number;
  name: string;
  category: string;
  targetValue: number;
  targetUnit: string;
};

type StopWatchProps = {
  exercises: ExerciseTarget[];
  onFinish: (laps: Lap[]) => void;
  onBack: () => void;
  targetRounds?: number;
};

export const Stopwatch = ({ exercises, onFinish, onBack, targetRounds = 1 }: StopWatchProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [currentType, setCurrentType] = useState<'exercise' | 'rest' | 'finished'>('exercise');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [lapIdCounter, setLapIdCounter] = useState(1);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [currentLapStartTime, setCurrentLapStartTime] = useState<Date | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showFinishEarlyModal, setShowFinishEarlyModal] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const currentExercise = exercises[exerciseIndex];
  const nextExercise = exercises[exerciseIndex + 1];
  const isLastExercise = exerciseIndex === exercises.length - 1;
  const isLastRound = currentRound === targetRounds;

  useEffect(() => {
    console.log('Laps updated:', laps);
  }, [laps]);

  useEffect(() => {
    if (isRunning && !workoutStartTime) {
      setWorkoutStartTime(new Date());
      setCurrentLapStartTime(new Date());
    }
  }, [isRunning, workoutStartTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((t) => t + 10);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    const now = new Date();
    setTime(0);
    setCurrentLapStartTime(now);

    if (currentType === 'exercise') {
      setLaps((prev) => [
        ...prev,
        {
          id: lapIdCounter,
          name: currentExercise?.name,
          type: 'exercise',
          duration: time,
          exerciseId: currentExercise?.id,
          startedAt: currentLapStartTime!,
          completedAt: now,
          targetValue: currentExercise?.targetValue,
          targetUnit: currentExercise?.targetUnit,
          // TODO: Capture actual value from user input
          actualValue: currentExercise?.targetValue,
          actualUnit: currentExercise?.targetUnit,
        },
      ]);
      setLapIdCounter((prev) => prev + 1);

      if (isLastExercise && isLastRound) {
        // Last exercise of last round - navigate to summary
        setIsRunning(false);
        setCurrentType('finished');
        return;
      }

      if (isLastExercise && !isLastRound) {
        // Last exercise of current round - add rest and move to next round
        setCurrentType('rest');
        return;
      }

      // Not last exercise - continue with rest
      setCurrentType('rest');
      return;
    }

    // Rest Period
    setLaps((prev) => [
      ...prev,
      {
        id: lapIdCounter,
        name: 'Rest',
        type: currentType,
        duration: time,
        startedAt: currentLapStartTime!,
        completedAt: now,
      },
    ]);
    setLapIdCounter((prev) => prev + 1);

    // Check if we just finished resting after the last exercise of a round
    if (isLastExercise && !isLastRound) {
      // Start next round - reset to first exercise
      setExerciseIndex(0);
      setCurrentRound((prev) => prev + 1);
      setCurrentType('exercise');
      return;
    }

    // Continue to next exercise in current round
    setExerciseIndex((prev) => prev + 1);
    setCurrentType('exercise');
  };

  const handleDiscard = () => {
    setShowDiscardModal(true);
  };

  const confirmDiscard = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setLapIdCounter(1);
    setCurrentType('exercise');
    setExerciseIndex(0);
    setCurrentRound(1);
    setShowDiscardModal(false);
    onBack();
  };

  const handleFinishEarly = () => {
    setShowFinishEarlyModal(true);
  };

  const confirmFinishEarly = () => {
    setIsRunning(false);
    setCurrentType('finished');
    setShowFinishEarlyModal(false);
    // Add current lap if running
    if (time > 0) {
      handleLap();
    }
  };

  const handleNavigateToSummary = () => {
    onFinish(laps);
  };

  if (currentType === 'finished') {
    return (
      <div className="flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm dark:bg-gray-900">
          <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            Workout Complete!
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-6">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-gray-900">
              <p className="text-center text-lg text-gray-600 dark:text-gray-400">
                Review your workout on the next page
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                className="w-full cursor-pointer rounded-lg bg-green-600 px-6 py-4 text-lg font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:bg-green-500 dark:hover:bg-green-400"
                onClick={handleNavigateToSummary}
              >
                Continue to Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 flex h-screen w-full flex-col bg-gray-50 dark:bg-gray-950">
        {/* Header with back button */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
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
              Workout in Progress
            </h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-hidden px-4 py-4">
          <div className="mx-auto w-full max-w-2xl space-y-3 md:space-y-4">
            <div className="rounded-lg bg-white p-4 shadow md:p-6 dark:bg-gray-900">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  {currentType === 'exercise' ? 'Current Exercise' : 'Rest Period'}
                </p>
                {targetRounds > 1 && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Round {currentRound} of {targetRounds}
                  </span>
                )}
              </div>
              <h2 className="mb-1 text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                {currentType === 'exercise' ? currentExercise?.name : 'Rest'}
              </h2>
              {currentType === 'exercise' && (
                <p className="text-base text-gray-600 md:text-lg dark:text-gray-400">
                  {currentExercise?.targetValue} {currentExercise?.targetUnit}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                Exercise {exerciseIndex + 1} of {exercises.length}
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow md:p-8 dark:bg-gray-900">
              <p
                role="timer"
                className="text-center font-mono text-5xl font-bold text-gray-900 tabular-nums md:text-6xl dark:text-white"
              >
                {formatTime(time)}
              </p>
            </div>

            {nextExercise && currentType === 'rest' && (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 md:p-6 dark:border-gray-700 dark:bg-gray-800">
                <p className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  Up Next
                </p>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 md:text-xl dark:text-white">
                  {nextExercise.name}
                </h3>
                <p className="text-sm text-gray-600 md:text-base dark:text-gray-400">
                  {nextExercise.targetValue} {nextExercise.targetUnit}
                </p>
              </div>
            )}

            {currentType === 'exercise' && !isLastExercise && (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 md:p-6 dark:border-gray-700 dark:bg-gray-800">
                <p className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  After Rest
                </p>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 md:text-xl dark:text-white">
                  {nextExercise?.name}
                </h3>
                <p className="text-sm text-gray-600 md:text-base dark:text-gray-400">
                  {nextExercise?.targetValue} {nextExercise?.targetUnit}
                </p>
              </div>
            )}
          </div>

          <div className="mx-auto w-full max-w-2xl flex-shrink-0 space-y-2 pt-4 md:space-y-3">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <button
                className="cursor-pointer rounded-lg bg-sky-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 md:px-6 md:py-4 md:text-lg dark:bg-sky-500 dark:hover:bg-sky-400"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                className="cursor-pointer rounded-lg bg-green-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-4 md:text-lg dark:bg-green-500 dark:hover:bg-green-400"
                onClick={handleLap}
                disabled={!isRunning}
              >
                {currentType === 'exercise' && isLastExercise
                  ? 'Finish'
                  : `Log ${currentType === 'exercise' ? 'Exercise' : 'Rest'}`}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <button
                className="cursor-pointer rounded-lg border-2 border-red-600 bg-transparent px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 md:px-4 md:py-3 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950"
                onClick={handleDiscard}
              >
                Discard Workout
              </button>
              <button
                className="cursor-pointer rounded-lg border-2 border-orange-600 bg-transparent px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 md:px-4 md:py-3 dark:border-orange-500 dark:text-orange-500 dark:hover:bg-orange-950"
                onClick={handleFinishEarly}
              >
                Finish Early
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDiscardModal}
        title="Discard Workout?"
        message="Are you sure you want to discard this workout? All your progress will be lost."
        confirmText="Discard"
        cancelText="Keep Going"
        confirmVariant="danger"
        onConfirm={confirmDiscard}
        onCancel={() => setShowDiscardModal(false)}
      />

      <ConfirmationModal
        isOpen={showFinishEarlyModal}
        title="Finish Early?"
        message="Do you want to finish this workout early? Your progress will be saved."
        confirmText="Finish Early"
        cancelText="Continue Workout"
        confirmVariant="warning"
        onConfirm={confirmFinishEarly}
        onCancel={() => setShowFinishEarlyModal(false)}
      />
    </>
  );
};
