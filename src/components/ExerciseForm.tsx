import { Exercise } from '@/context/WorkoutContext/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useWorkoutForm } from '@/context/WorkoutContext/context';

type Inputs = {
  value: number;
  timeTakenMins: number;
  timeTakenSecs: number;
};

export const ExerciseForm = ({ exercise }: { exercise: Exercise }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const { state, enterExerciseValue } = useWorkoutForm();

  console.log({ exercise });
  console.log(state.selectedExercises);
  console.log(state.exerciseEntries);

  const calculateTime = (mins: number, secs: number) => {
    return mins * 60 + secs;
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const timeTaken = calculateTime(data.timeTakenMins, data.timeTakenSecs);
    enterExerciseValue({ exerciseId: exercise.id, timeTaken, value: data.value });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm text-black">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{exercise.category}</p>

          <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <label className="text-gray-900">
              {exercise.unit === 'meters' ? 'Distance (m)' : 'Weight (kg)'}
            </label>
            <input
              className="border-2 border-slate-400 rounded-md"
              placeholder={exercise.unit === 'meters' ? '1000' : '50'}
              type="number"
              {...register('value')}
            />

            <label className="text-gray-900">
              How long did it take you to complete the exercise? (mins) / (secs)
            </label>
            <span className="flex flex-row justify-between gap-8">
              <input
                className="border-2 border-slate-400 rounded-md"
                placeholder="4 mins"
                type="number"
                {...register('timeTakenMins')}
              />
              <input
                className="border-2 border-slate-400 rounded-md"
                placeholder="30 seconds"
                type="number"
                {...register('timeTakenSecs')}
              />
            </span>
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Submit
            </button>
          </form>
        </div>
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {exercise.unit}
        </span>
      </div>
    </div>
  );
};
