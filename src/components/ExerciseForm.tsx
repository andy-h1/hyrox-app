import { ExerciseData, ExerciseEntry, ExerciseList } from '@/context/WorkoutContext/types';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  value: number;
  timeTakenMins: number;
  timeTakenSecs: number;
};

type ExerciseFormProps = {
  exercise: ExerciseList;
  setExerciseValues: React.Dispatch<React.SetStateAction<ExerciseEntry[]>>;
};

export const ExerciseForm = ({ exercise, setExerciseValues }: ExerciseFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  console.log(exercise);

  const calculateTime = (mins: number, secs: number) => {
    return Number(mins) * 60 + Number(secs);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const timeTaken = calculateTime(data.timeTakenMins, data.timeTakenSecs);
    setExerciseValues((prevState) => {
      const filtered = prevState.filter((entry) => entry.id !== exercise.id);
      const newEntry = {
        ...exercise,
        exerciseId: exercise.id,
        value: data.value,
        timeTaken,
      };

      return [...filtered, newEntry];
    });
  };

  // TODO: we currently render a button on each component with a submit butt
  // Ideally we just have one button which submits all the values
  // Should I move it into WorkoutWizard?
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 text-black shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{exercise.category}</p>

          <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <label className="text-gray-900">
              {exercise.unit === 'meters' ? 'Distance (m)' : 'Weight (kg)'}
            </label>
            <input
              className="rounded-md border-1 border-slate-400 p-1"
              placeholder={exercise.unit === 'meters' ? '1000' : '50'}
              type="number"
              min="0"
              {...register('value')}
            />

            <label className="text-gray-900">
              How long did it take you to complete the exercise? (mins) / (secs)
            </label>
            <span className="flex flex-row justify-start gap-8">
              <input
                className="rounded-md border-1 border-slate-400 p-1"
                placeholder="4 mins"
                type="number"
                min="0"
                {...register('timeTakenMins')}
              />
              <input
                className="rounded-md border-1 border-slate-400 p-1"
                placeholder="30 seconds"
                type="number"
                min="0"
                max="59"
                {...register('timeTakenSecs')}
              />
            </span>
            <button
              type="submit"
              className="cursor-pointer rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Submit
            </button>
          </form>
        </div>
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
          {exercise.unit}
        </span>
      </div>
    </div>
  );
};
