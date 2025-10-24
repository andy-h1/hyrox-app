'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createWorkoutTemplate } from '@/lib/database/workouts';

enum WorkoutFormat {
  AMRAP = 'AMRAP',
  ENOM = 'EMOM',
  FOR_TIME = 'For time',
  INTERVALS = 'Intervals',
}

type SelectedExercises = {
  exerciseId: number;
  targetValue: number;
  targerUnit: number;
  orderInIndex: number;
};

export type WorkoutTemplateInput = {
  name: string;
  description?: string;
  format: WorkoutFormat;
  duration?: number;
  targetRounds?: number;
  isPublic: boolean;
  exercises: SelectedExercises[];
};

export async function createWorkoutTemplateAction(formData: FormData, userId: number) {
  const workout = await createWorkoutTemplate(formData, userId);

  revalidatePath('/workouts');
  redirect('/workouts/');
}
