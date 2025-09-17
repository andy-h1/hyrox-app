'use client';
import { ExerciseCards } from './ExerciseCards';
import { ExerciseForm } from './ExerciseForm';
import { useState } from 'react';
import { ExerciseData, ExerciseList } from '@/context/WorkoutContext/types';

type WorkoutWizardProps = {
  exerciseList: ExerciseList[];
};
export const WorkoutWizard: React.FC<WorkoutWizardProps> = ({ exerciseList }) => {
  // note: omit createdAt and adding order to properties
  const [selectedExercises, setSelectedExercises] = useState<ExerciseData[]>([]);
  console.log(selectedExercises);

  return (
    <>
      <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl border-2 border-solid border-slate-300 bg-white p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y8- dark:inset-ring dark:inset-ring-white/10">
        <p className="flex-none text-3xl font-bold tracking-tight text-slate-800">Training!</p>
        <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
          <p className="text-lg font-semibold tracking-tight text-slate-800">
            I want to log in my own workout!
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl border-2 border-solid border-slate-300 bg-white p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y8- dark:inset-ring dark:inset-ring-white/10">
        <p className="flex-none text-3xl font-bold tracking-tight text-slate-800">
          Hyrox Simulation
        </p>
        <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
          <p className="text-lg font-semibold tracking-tight text-slate-800">
            I want to follow up a pre-defined hyrox sim workout!
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Select Exercises:</h2>
        <ExerciseCards
          exerciseList={exerciseList}
          selectedExercises={selectedExercises}
          setSelectedExercises={setSelectedExercises}
        />
      </div>

      {selectedExercises.length > 0 && (
        <div className="mt-8 flex flex-col gap-8">
          <h2>Log Your Exercises:</h2>
          {selectedExercises.map((exercise) => (
            <div key={exercise.id}>
              <ExerciseForm exercise={exercise} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
