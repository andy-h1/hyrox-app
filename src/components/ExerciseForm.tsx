import { ExerciseList } from '@/context/WorkoutContext/types';
import { useFormContext } from 'react-hook-form';

type ExerciseFormProps = {
  exercise: ExerciseList;
};

export const ExerciseForm: React.FC<ExerciseFormProps> = ({ exercise }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const watchValue = watch(`exercises.${exercise.id}.value`);

  return (
    <div className="rounded-md border border-gray-400 bg-white p-6 text-black">
      <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
      <p className="text-sm text-gray-500 capitalize">{exercise.category}</p>
      <div className="flex flex-col gap-2">
        <label className="text-gray-900">
          {exercise.unit === 'meters' ? 'Distance (m)' : 'Weight (kg)'}
        </label>
        <input
          className="rounded-md border-1 border-slate-400 p-1"
          placeholder={exercise.unit === 'meters' ? '1000' : '50'}
          type="number"
          min="0"
          // NOTE: Using string interpolation so that each input is unique to that exercises
          {...register(`exercises.${exercise.id}.value`, { valueAsNumber: true })}
        />

        <label className="text-gray-900">
          How long did it take you to complete the exercise? (mins) / (secs)
        </label>
        <span className="flex flex-row justify-start gap-8">
          <input
            className="rounded-md border-1 border-slate-400 p-1 w-full"
            placeholder="4 mins"
            type="number"
            min="0"
            {...register(`exercises.${exercise.id}.timeTakenMins`, { valueAsNumber: true })}
          />
          <input
            className="rounded-md border-1 border-slate-400 p-1 w-full"
            placeholder="30 seconds"
            type="number"
            min="0"
            max="59"
            {...register(`exercises.${exercise.id}.timeTakenSecs`, { valueAsNumber: true })}
          />
        </span>
      </div>
    </div>
  );
};
