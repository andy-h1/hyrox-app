'use client';

import { useWorkoutForm } from '@/context/WorkoutContext/context';
import { Exercise } from '@/context/WorkoutContext/types';

type Cards = {
  exercises: Exercise[];
};

export const Cards = ({ exercises }: { exercises: Exercise[] }) => {
  const { state, selectExercises } = useWorkoutForm();

  const toggleExercise = (exercise: Exercise) => {
    const { id, name, unit, category, optimization } = exercise;
    const currentSelected = state.selectedExercises;
    const isSelected = currentSelected.some((ex) => ex.id === id);

    const newSelection = isSelected
      ? currentSelected.filter((ex) => ex.id !== id)
      : [
          ...currentSelected,
          {
            id,
            name,
            unit,
            category,
            optimization,
          },
        ];

    selectExercises(newSelection);
  };

  console.log(state.selectedExercises);
  return (
    <div className="rounded-2xl border-2 border-solid border-slate-300 bg-white p-8 dark:inset-ring dark:inset-ring-white/10">
      <div className="grid grid-cols-2 gap-4">
        {exercises.map((exercise) => {
          const isSelected = state.selectedExercises.some((ex) => ex.id === exercise.id);

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
  );
};
