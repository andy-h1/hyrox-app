import { Dispatch } from 'react';

export type WorkoutFormStage =
  | 'selectWorkoutType'
  | 'selectExercises'
  | 'enterExerciseValues'
  | 'confirm';

export type WorkoutType = 'forTraining' | 'hyroxSim';

export type Exercise = {
  id: number;
};

export type ExerciseEntry = {
  workoutId: number;
  exerciseId: number;
  values: {
    value: number;
    timeTaken: number;
    order: number;
  };
};

export type ConfirmEntry = {
  isConfirmed: boolean;
  notes: string;
};

export type State = {
  stage: WorkoutFormStage;
  workoutType: WorkoutType;
  selectedExercises: Exercise[];
  exerciseEntries: ExerciseEntry[];
  confirmWorkout: ConfirmEntry;
};

export type Action =
  | { type: 'SET_WORKOUT_TYPE'; payload: WorkoutType }
  | { type: 'SELECT_EXERCISES'; payload: Exercise[] }
  | { type: 'ENTER_EXERCISE_VALUES'; payload: ExerciseEntry[] }
  | { type: 'NEXT_STAGE' }
  | { type: 'PREV_STAGE' }
  | { type: 'CONFIRM' }
  | { type: 'RESET' };

export type WorkoutFormContextType = {
  state: State;
  dispatch: Dispatch<Action>;
  setWorkoutType: (type: WorkoutType) => void;
  selectExercises: (exercises: Exercise[]) => void;
  nextStage: () => void;
  prevStage: () => void;
  canProceedToNext: () => boolean;
};
