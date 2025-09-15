import { Exercise } from '@/context/WorkoutContext/types';

export const ExerciseForm = ({ exercise }: { exercise: Exercise }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{exercise.category}</p>
        </div>
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {exercise.unit}
        </span>
      </div>
    </div>
  );
};
