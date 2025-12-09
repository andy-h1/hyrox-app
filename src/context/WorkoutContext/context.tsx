'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  State,
  Action,
  WorkoutFormStage,
  WorkoutType,
  Exercise,
  WorkoutFormContextType,
  ExerciseEntry,
} from './types';

const initialState: State = {
  stage: 'selectWorkoutType',
  workoutType: 'forTraining',
  selectedExercises: [],
  exerciseEntries: {
    id: 0,
    value: 0,
    timeTaken: 0,
  },
  confirmWorkout: {
    isConfirmed: false,
    notes: '',
  },
};

const getNextStage = (currentStage: WorkoutFormStage): WorkoutFormStage => {
  const stageOrder: WorkoutFormStage[] = [
    'selectWorkoutType',
    'selectExercises',
    'enterExerciseValues',
    'confirm',
  ];

  const currentIndex = stageOrder.indexOf(currentStage);
  return stageOrder[currentIndex + 1] || currentStage;
};

const getPrevStage = (currentStage: WorkoutFormStage): WorkoutFormStage => {
  const stageOrder: WorkoutFormStage[] = [
    'selectWorkoutType',
    'selectExercises',
    'enterExerciseValues',
    'confirm',
  ];

  const currentIndex = stageOrder.indexOf(currentStage);
  return stageOrder[currentIndex - 1] || currentStage;
};

// Reducer function
const workoutFormReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_WORKOUT_TYPE':
      return {
        ...state,
        workoutType: action.payload,
      };

    case 'SELECT_EXERCISES':
      return {
        ...state,
        selectedExercises: action.payload,
      };

    case 'ENTER_EXERCISE_VALUES':
      return {
        ...state,
        exerciseEntries: action.payload,
      };

    case 'NEXT_STAGE':
      return {
        ...state,
        stage: getNextStage(state.stage),
      };

    case 'PREV_STAGE':
      return {
        ...state,
        stage: getPrevStage(state.stage),
      };

    case 'CONFIRM':
      return {
        ...state,
        confirmWorkout: {
          ...state.confirmWorkout,
          isConfirmed: true,
        },
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
};

const WorkoutFormContext = createContext<WorkoutFormContextType | undefined>(undefined);

export const WorkoutFormProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(workoutFormReducer, initialState);

  // Helper functions
  const setWorkoutType = (type: WorkoutType) => {
    dispatch({ type: 'SET_WORKOUT_TYPE', payload: type });
  };

  const selectExercises = (exercises: Exercise[]) => {
    dispatch({ type: 'SELECT_EXERCISES', payload: exercises });
  };

  const enterExerciseValue = (exerciseValues: ExerciseEntry) => {
    dispatch({ type: 'ENTER_EXERCISE_VALUES', payload: exerciseValues });
  };

  const nextStage = () => {
    dispatch({ type: 'NEXT_STAGE' });
  };

  const prevStage = () => {
    dispatch({ type: 'PREV_STAGE' });
  };

  // Unable to move to next step - validation
  const canProceedToNext = (): boolean => {
    switch (state.stage) {
      case 'selectWorkoutType':
        return !!state.workoutType;
      case 'selectExercises':
        return state.selectedExercises.length > 0;
      case 'enterExerciseValues':
        return state.exerciseEntries != undefined;
      case 'confirm':
        return state.confirmWorkout.isConfirmed;
      default:
        return false;
    }
  };

  const value: WorkoutFormContextType = {
    state,
    dispatch,
    setWorkoutType,
    selectExercises,
    enterExerciseValue,
    nextStage,
    prevStage,
    canProceedToNext,
  };

  return <WorkoutFormContext.Provider value={value}>{children}</WorkoutFormContext.Provider>;
};

export const useWorkoutForm = (): WorkoutFormContextType => {
  const context = useContext(WorkoutFormContext);

  if (context === undefined) {
    throw new Error('useWorkoutForm must be used within a WorkoutFormProvider');
  }

  return context;
};

export type { WorkoutFormContextType };
