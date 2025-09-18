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
  const toggleExercise = (exercise: ExerciseList) => {
    setSelectedExercises((prevState) => {
      const doesExerciseExist = prevState.find((ex) => ex.id === exercise.id);
      let updatedList;

      // NOTE: if exercise exists return me a filtered list excluding that exercises
      if (doesExerciseExist) {
        updatedList = prevState.filter((ex) => ex.id !== exercise.id);
      } else {
        // NOTE: if exercise doesn't exist add it to the previous state and reset the order back to 0
        updatedList = [...prevState, { ...exercise, order: 0 }];
      }
      return updatedList.map((ex, index) => ({ ...ex, order: index + 1 }));
    });
  };

  return (
    <>
      <div className="rounded-2xl border-2 border-solid border-slate-300 bg-white p-8 dark:inset-ring dark:inset-ring-white/10">
        <div className="grid grid-cols-2 gap-4">
          {exerciseList.map((exercise) => {
            const isSelected = selectedExercises.some((ex) => ex.id === exercise.id);
            return (
              <div
                key={exercise.id}
                onClick={() => toggleExercise(exercise)}
                className={`
                overflow-hidden shadow-sm rounded-lg p-4 cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? 'bg-blue-100 border-2 border-blue-500 ring-2 ring-blue-200 dark:bg-blue-900/30 dark:border-blue-400'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-600/50'
                }
              `}
              >
                <div
                  className={`text-sm font-medium ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}
                >
                  {exercise.name}
                </div>
                <div
                  className={`text-xs ${isSelected ? 'text-blue-700' : 'text-white-500 dark:text-white-400'}`}
                >
                  {exercise.unit} • {exercise.category}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
