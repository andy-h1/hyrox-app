'use client';
import { ExerciseCards } from './ExerciseCards';
import { ExerciseForm } from './ExerciseForm';
import { useState } from 'react';
import {
  ExerciseData,
  ExerciseEntry,
  ExerciseList,
  WorkoutType,
} from '@/context/WorkoutContext/types';
import { formatDate } from '@/utils/formatDate';
import { SubmitHandler, useForm } from 'react-hook-form';

type WorkoutWizardProps = {
  exerciseList: ExerciseList[];
};

type SummaryInput = {
  workoutName: string;
  notes: string;
};

export const WorkoutWizard: React.FC<WorkoutWizardProps> = ({ exerciseList }) => {
  // note: omit createdAt and adding order to properties
  const [selectedExercises, setSelectedExercises] = useState<ExerciseData[]>([]);
  const [exerciseValues, setExerciseValues] = useState<ExerciseEntry[]>([]);
  const [workoutType, setWorkoutType] = useState<WorkoutType>();
  const { register, handleSubmit } = useForm<SummaryInput>();

  console.log({ exerciseValues });

  const onClickWorkoutType = (type: WorkoutType) => {
    console.log('clicked');
    setWorkoutType(type);
  };

  const logWorkout: SubmitHandler<SummaryInput> = async (data) => {
    const workoutData = {
      name: data.workoutName,
      type: workoutType,
      notes: data.notes,
      exercises: exerciseValues,
    };
    console.log({ workoutData });

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });
      console.log({ response });

      if (!response.ok) {
        throw new Error('Failed to create workout');
      }

      const result = await response.json();
      console.log('Workout created', result.data);
    } catch (error) {
      console.log('Error creating workout:', error);
    }
  };

  return (
    <>
      <button
        id="forTrainingBtn"
        className="cursor-pointer lg:gap-y8- flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl border-2 border-solid border-slate-300 bg-blue-950 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start dark:inset-ring dark:inset-ring-white/10 hover:bg-blue-800 focus-visible:outline-offset-2 focus-visible: outline-2 focus-visible:outline-sky-500 "
        onClick={() => onClickWorkoutType('forTraining')}
      >
        <p className="text-3xl font-bold text-white">Training!</p>
        <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
          <p className="text-lg font-semibold text-white">I want to log in my own workout!</p>
        </div>
      </button>

      <button
        id="hyroxSim"
        className="cursor-pointer lg:gap-y8- flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl border-2 border-solid border-slate-300 bg-blue-950 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start dark:inset-ring dark:inset-ring-white/10 hover:bg-blue-800 focus-visible:outline-offset-2 focus-visible: outline-2 focus-visible:outline-sky-500 "
        onClick={() => onClickWorkoutType('hyroxSim')}
      >
        <p className="text-3xl font-bold text-white">Hyrox Simulation</p>
        <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
          <p className="text-lg font-semibold text-white">
            I want to follow up a pre-defined hyrox sim workout!
          </p>
        </div>
      </button>

      <div className="w-full max-w-4xl">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">Select Exercises:</h2>
        <ExerciseCards
          exerciseList={exerciseList}
          selectedExercises={selectedExercises}
          setSelectedExercises={setSelectedExercises}
        />
      </div>

      {selectedExercises.length > 0 && (
        <div className="mt-8 flex flex-col gap-8 pointer-events-auto">
          <h2>Log Your Exercises:</h2>
          {selectedExercises.map((exercise) => (
            <div key={exercise.id}>
              <ExerciseForm exercise={exercise} setExerciseValues={setExerciseValues} />
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit(logWorkout)}
        className="flex w-full flex-col rounded-md border-2 border-solid border-slate-300 p-8 gap-3"
      >
        <h2 className="font-bold">Summary of your workout</h2>
        <p className="text-gray-500">{formatDate(new Date())}</p>
        <label className="text-gray-900 mb-0">Workout name</label>
        <input
          className="rounded-md border-1 border-slate-400 p-1"
          type="text"
          defaultValue={workoutType === 'forTraining' ? 'Training session' : 'Hyrox simulation'}
          {...register('workoutName')}
        />

        <label>
          <textarea
            className="rounded-md border-1 border-solid border-slate-400 w-full p-4"
            id="notes"
            placeholder="Would you like to add any notes to your workout?"
            {...register('notes')}
          />
        </label>
        <button
          type="submit"
          className="cursor-pointer rounded-md bg-blue-950 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        >
          Finish workout
        </button>
      </form>
    </>
  );
};
