import { useState, useEffect, useRef } from 'react';

interface Lap {
  id: number;
  type: 'exercise' | 'rest';
  duration: number;
}

export const Stopwatch = () => {
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
    <div>
      <h1>Workout stopwatch</h1>

      <p>{formatTime(time)}</p>

      <h3>Current: {currentType.toUpperCase()}</h3>

      <span>
        <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Pause' : 'Start'}</button>
        <button onClick={handleLap} disabled={!isRunning}>
          Log {currentType === 'exercise' ? 'Exercise' : 'Rest'}
        </button>
        <button onClick={reset}>Reset all</button>
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
