import { useState } from 'react';

export const Stopwatch = () => {
  const [laps, setLaps] = useState([]);

  return (
    <>
      <button>Start</button>
      <button>Pause</button>
      <button>Finish exercise</button>
      <button>End workout</button>
    </>
  );
};
