import { Exercise } from '@prisma/client';
import { useState, useEffect, useRef } from 'react';

export type Lap = {
  id: number;
  name: string;
  type: 'exercise' | 'rest' | 'finished';
  duration: number;
};

type ExerciseTarget = {
  id: number;
  name: string;
  category: string;
  targetValue: number;
  targetUnit: string;
};

type StopWatchProps = {
  exercises: ExerciseTarget[];
  onSave: (laps: Lap[]) => Promise<void>;
};

export const Stopwatch = ({ exercises, onSave }: StopWatchProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [currentType, setCurrentType] = useState<'exercise' | 'rest' | 'finished'>('exercise');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [lapIdCounter, setLapIdCounter] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const currentExercise = exercises[exerciseIndex];
  const isLastExercise = exerciseIndex === exercises.length - 1;

  useEffect(() => {
    console.log('Laps updated:', laps);
  }, [laps]);

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
    setTime(0);

    if (currentType === 'exercise') {
      setLaps((prev) => [
        ...prev,
        {
          id: lapIdCounter,
          name: currentExercise?.name,
          type: currentType,
          duration: time,
          exerciseId: currentExercise?.id,
        },
      ]);
      setLapIdCounter((prev) => prev + 1);

      if (isLastExercise) {
        //Last exercise
        setIsRunning(false);
        setCurrentType('finished');
        return;
      }
      setCurrentType('rest');
      return;
    }
    //Rest Period
    setLaps((prev) => [
      ...prev,
      { id: lapIdCounter, name: 'Rest', type: currentType, duration: time },
    ]);
    setExerciseIndex((prev) => prev + 1);
    setLapIdCounter((prev) => prev + 1);
    setCurrentType('exercise');
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setLapIdCounter(1);
    setCurrentType('exercise');
    setExerciseIndex(0);
  };

  const handleSaveWorkout = async () => {
    setIsSaving(true);
    await onSave(laps);
  };

  return (
    <div className="flex w-full flex-col place-content-center justify-center rounded-md border-2 p-4">
      {currentType === 'finished' ? (
        //Summary view
        <div>
          <h2>Workout Complete! 🎉</h2>
          <p>Total Time: {formatTime(laps.reduce((acc, lap) => acc + lap.duration, 0))}</p>
          <p>Exercises: {laps.filter((l) => l.type === 'exercise').length}</p>

          <h3>Summary:</h3>
          {laps.map((lap) => (
            <p key={lap.id}>
              {lap.name}: {formatTime(lap.duration)}
            </p>
          ))}
        </div>
      ) : (
        <>
          <p>{formatTime(time)}</p>

          <h3>
            {currentType === 'exercise'
              ? `Exercise ${exerciseIndex + 1}/${exercises.length}: ${currentExercise?.name}`
              : `Rest (Next: ${exercises[exerciseIndex + 1]?.name || 'Finished'})`}
          </h3>
          <h3>Laps ({laps.length})</h3>
          {laps.map((l) => (
            <p key={l.id}>
              #{l.name}: {formatTime(l.duration)}
            </p>
          ))}
        </>
      )}

      <span className="grid gap-4 md:grid-cols-3">
        {currentType === 'finished' ? (
          <>
            <button
              className="cursor-pointer rounded-md bg-green-800 px-6 py-3 text-xl font-semibold text-white shadow-xs hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:bg-green-500 dark:shadow-none dark:hover:bg-green-400 dark:focus-visible:outline-green-500"
              onClick={handleSaveWorkout}
            >
              Save Workout
            </button>
            <button
              className="cursor-pointer rounded-md bg-red-800 px-6 py-3 text-xl font-semibold text-white shadow-xs hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-red-500 dark:shadow-none dark:hover:bg-red-400 dark:focus-visible:outline-red-500"
              onClick={reset}
            >
              Discard
            </button>
          </>
        ) : (
          <>
            <button
              className="cursor-pointer rounded-md bg-sky-950 px-6 py-3 text-xl font-semibold text-white shadow-xs hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:shadow-none dark:hover:bg-sky-400 dark:focus-visible:outline-sky-500"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              className="cursor-pointer rounded-md bg-green-800 px-6 py-3 text-xl font-semibold text-white shadow-xs hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:bg-green-500 dark:shadow-none dark:hover:bg-green-400 dark:focus-visible:outline-green-500"
              onClick={handleLap}
              disabled={!isRunning}
            >
              {currentType === 'exercise' && isLastExercise
                ? 'Finish workout'
                : `Log ${currentType === 'exercise' ? 'Exercise' : 'Rest'}`}
            </button>
            <button
              className="cursor-pointer rounded-md bg-red-800 px-6 py-3 text-xl font-semibold text-white shadow-xs hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-red-500 dark:shadow-none dark:hover:bg-red-400 dark:focus-visible:outline-red-500"
              onClick={reset}
            >
              Reset all
            </button>
          </>
        )}
      </span>
    </div>
  );
};
