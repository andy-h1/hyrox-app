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
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ProgressBar } from './ProgressBar';

type WorkoutWizardProps = {
  exerciseList: ExerciseList[];
};

type FormInputs = {
  workoutName: string;
  notes: string;
  exercises: {
    [exerciseId: string]: {
      value: number;
      timeTakenMins: number;
      timeTakenSecs: number;
    };
  };
};
const steps = [
  { name: 'Workout Type', status: 'current' },
  { name: 'Choose exercises', status: 'upcoming' },
  { name: 'Log workout values', status: 'upcoming' },
  { name: 'Summary', status: 'upcoming' },
];

export const WorkoutWizard: React.FC<WorkoutWizardProps> = ({ exerciseList }) => {
  // note: omit createdAt and adding order to properties
  const [selectedExercises, setSelectedExercises] = useState<ExerciseData[]>([]);
  const [workoutType, setWorkoutType] = useState<WorkoutType>('forTraining');
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<FormInputs>();
  const router = useRouter();

  const nextStep = () => setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  const backStep = () => setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));

  const onClickWorkoutType = (type: WorkoutType) => {
    setWorkoutType(type);
    nextStep();
  };

  const logWorkout: SubmitHandler<FormInputs> = async (data) => {
    const exerciseValues: ExerciseEntry[] = selectedExercises
      .map((exercise) => {
        const entry = data.exercises?.[exercise.id];
        if (!entry) return null;

        const timeTaken = Number(entry.timeTakenMins) * 60 + Number(entry.timeTakenSecs);
        return {
          ...exercise,
          exerciseId: exercise.id,
          value: entry.value,
          timeTaken,
        };
      })
      .filter(Boolean) as ExerciseEntry[];

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

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.log('Error creating workout:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <ProgressBar steps={steps} currentStep={currentStep} />

      <form className="w-full flex flex-col gap-8" onSubmit={methods.handleSubmit(logWorkout)}>
        {currentStep === 0 && (
          <div className="flex flex-col gap-3">
            <button
              id="forTrainingBtn"
              className="cursor-pointer rounded-md w-full bg-sky-950 px-6 py-3 text-3xl font-semibold text-white shadow-xs hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:shadow-none dark:hover:bg-sky-400 dark:focus-visible:outline-sky-500"
              onClick={() => onClickWorkoutType('forTraining')}
            >
              Training!
              {/* <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold text-white">I want to log in my own workout!</p>
              </div> */}
            </button>

            <button
              id="hyroxSim"
              className="cursor-pointer rounded-md w-full bg-sky-950 px-3.5 py-2.5 text-3xl font-semibold text-white shadow-xs hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:shadow-none dark:hover:bg-sky-400 dark:focus-visible:outline-sky-500"
              onClick={() => onClickWorkoutType('hyroxSim')}
            >
              Hyrox Simulation
              {/* <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold text-white">
                  I want to follow up a pre-defined hyrox sim workout!
                </p>
              </div> */}
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="w-full max-w-4xl flex flex-col gap-4">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">Select Exercises:</h2>
            <ExerciseCards
              exerciseList={exerciseList}
              selectedExercises={selectedExercises}
              setSelectedExercises={setSelectedExercises}
            />
            <button
              type="button"
              onClick={nextStep}
              className="rounded-md w-full bg-sky-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:shadow-none dark:hover:bg-sky-400 dark:focus-visible:outline-sky-500"
            >
              Next
            </button>
          </div>
        )}

        {currentStep === 2 && selectedExercises.length > 0 && (
          <div className="mt-8 flex flex-col gap-8 pointer-events-auto">
            <h2>Log Your Exercises:</h2>
            {selectedExercises.map((exercise) => (
              <ExerciseForm key={exercise.id} exercise={exercise} />
            ))}
            <button
              type="button"
              onClick={nextStep}
              className="rounded-md w-full bg-sky-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:shadow-none dark:hover:bg-sky-400 dark:focus-visible:outline-sky-500"
            >
              Submit
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex w-full flex-col rounded-md border-2 border-solid border-slate-300 p-8 gap-3">
            <h2 className="font-bold">Summary of your workout</h2>
            <p className="text-gray-500">{formatDate(new Date())}</p>
            <label className="text-gray-900 mb-0">Workout name</label>
            <input
              className="rounded-md border-1 border-slate-400 p-1"
              type="text"
              defaultValue={workoutType === 'forTraining' ? 'Training session' : 'Hyrox simulation'}
              {...methods.register('workoutName')}
            />

            <label>
              <textarea
                className="rounded-md border-1 border-solid border-slate-400 w-full p-4"
                id="notes"
                placeholder="Would you like to add any notes to your workout?"
                {...methods.register('notes')}
              />
            </label>
            <button
              type="submit"
              className="cursor-pointer rounded-md bg-blue-950 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              Finish workout
            </button>
          </div>
        )}

        {currentStep === 0 && (
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="rounded-md w-full bg-teal-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 dark:bg-teal-400 dark:shadow-none dark:hover:bg-teal-400 dark:focus-visible:outline-teal-500"
          >
            Back to Dashboard
          </button>
        )}

        {currentStep > 0 && (
          <button
            type="button"
            onClick={backStep}
            className="rounded-md w-full bg-teal-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 dark:bg-teal-400 dark:shadow-none dark:hover:bg-teal-400 dark:focus-visible:outline-teal-500"
          >
            Back
          </button>
        )}
      </form>
    </FormProvider>
  );
};
