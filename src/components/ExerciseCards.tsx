'use client';
import { ExerciseData, ExerciseList } from '@/context/WorkoutContext/types';

type CardsProps = {
  exerciseList: ExerciseList[];
  selectedExercises: ExerciseData[];
  setSelectedExercises: React.Dispatch<React.SetStateAction<ExerciseData[]>>;
};

export const ExerciseCards = ({
  exerciseList,
  selectedExercises,
  setSelectedExercises,
}: CardsProps) => {
  const createInstanceId = (exerciseId: string | number) => {
    return `${exerciseId}-${Date.now()}=${Math.floor(Math.random() * 1_000_000)}`;
  };

  const addExerciseInstance = (exercise: ExerciseList) => {
    setSelectedExercises((prev) => {
      const newInstance: ExerciseData = {
        ...exercise,
        instanceId: createInstanceId(exercise.id),
        orderInWorkout: prev.length + 1,
      };
      return [...prev, newInstance];
    });
  };

  const removeLastInstanceOfExercise = (exercises: ExerciseList) => {
    setSelectedExercises((prev) => {
      const lastIndex = [...prev]
        .map((exercise, index) => ({ exercise, index }))
        .filter(({ exercise }) => exercise.id === exercises.id)
        .map(({ index }) => index)
        .pop();

      if (lastIndex === undefined) {
        return prev;
      }

      const next = prev.filter((_, index) => index !== lastIndex);
      return next.map((exercise, index) => ({ ...exercise, orderInWorkout: index + 1 }));
    });
  };

  const countSelected = (exerciseId: string | number) =>
    selectedExercises.filter((ex) => ex.id === exerciseId).length;

  return (
    <>
      <div className="w-full rounded-2xl border-2 border-solid border-slate-300 bg-white p-8 dark:inset-ring dark:inset-ring-white/10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exerciseList.map((exercise) => {
            const selectedCount = countSelected(exercise.id);
            const isSelected = selectedCount > 0;

            return (
              <div
                key={exercise.id}
                className={`overflow-hidden rounded-lg border-2 p-4 shadow-sm transition-all duration-200 ${
                  isSelected
                    ? 'border-amber-600 bg-amber-400 ring-2 ring-amber-200 dark:border-blue-400 dark:bg-blue-900/30'
                    : 'border-transparent bg-amber-200 hover:bg-amber-300 dark:bg-gray-700/50 dark:hover:bg-gray-600/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => addExerciseInstance(exercise)}
                  className="w-full cursor-pointer text-left"
                >
                  <div
                    className={`text-sm font-medium ${
                      isSelected
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {exercise.name}
                  </div>
                  <div
                    className={`text-xs ${
                      isSelected ? 'text-blue-700' : 'text-white-500 dark:text-white-400'
                    }`}
                  >
                    • {exercise.category}
                  </div>
                </button>

                {/* Controls row */}
                <div className="mt-3 flex items-center justify-between">
                  <div
                    className={`text-xs font-medium ${
                      isSelected
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {isSelected ? `Selected × ${selectedCount}` : 'Not selected'}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addExerciseInstance(exercise)}
                      className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      aria-label={`Add ${exercise.name}`}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLastInstanceOfExercise(exercise)}
                      disabled={!isSelected}
                      className={`rounded-md px-2 py-1 text-xs font-semibold focus:ring-2 focus:outline-none ${
                        isSelected
                          ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400'
                          : 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                      }`}
                      aria-label={`Remove last ${exercise.name}`}
                    >
                      Remove last
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
