import { Exercise } from '@prisma/client';
import { useState, useEffect, useRef } from 'react';

type Lap = {
  id: number;
  type: 'exercise' | 'rest';
  duration: number;
};

type StopWatchProps = {
  exercises: Exercise[];
};

export const Stopwatch = ({ exercises }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [currentType, setCurrentType] = useState<'exercise' | 'rest'>('exercise');
  const intervalRef = useRef<number | null>(null);

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
    setLaps((prev) => [...prev, { id: Date.now(), type: currentType, duration: time }]);
    setTime(0);
    setCurrentType(currentType === 'exercise' ? 'rest' : 'exercise');
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setCurrentType('exercise');
  };

  return (
    <div className="flex w-full flex-col place-content-center justify-center rounded-md border-2">
      <p>{formatTime(time)}</p>

      <h3>Current: {currentType.toUpperCase()}</h3>

      <span className="grid gap-4 md:grid-cols-3">
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
          Log {currentType === 'exercise' ? 'Exercise' : 'Rest'}
        </button>
        <button
          className="cursor-pointer rounded-md bg-red-800 px-6 py-3 text-xl font-semibold text-white shadow-xs hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-red-500 dark:shadow-none dark:hover:bg-red-400 dark:focus-visible:outline-red-500"
          onClick={reset}
        >
          Reset all
        </button>
      </span>

      <h3>Laps ({laps.length})</h3>
      {laps.map((lap, index) => (
        <p key={lap.id}>
          #{index + 1} - {lap.type}: {formatTime(lap.duration)}
        </p>
      ))}
    </div>
  );
};
