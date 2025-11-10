'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createWorkoutTemplate } from '@/lib/database/workouts';
import { redirect } from 'next/navigation';

const workoutDataSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  description: z.string().optional(),
  format: z.enum(['AMRAP', 'FOR_TIME', 'EMOM']),
  duration: z.coerce.number().positive().optional(),
  targetRounds: z.coerce.number().positive().optional(),
  isPublic: z.boolean(),
  exercises: z
    .array(
      z.object({
        exerciseId: z.number(),
        targetValue: z.number().positive('Target value must be positive'),
        targetUnit: z.string().min(1),
        orderIndex: z.number(),
        notes: z.string().optional(),
      }),
    )
    .min(1, 'Select at least one exercise'),
});

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

export async function createWorkoutTemplateAction(formData: FormData) {
  await createWorkoutTemplate(formData);

  revalidatePath('/workouts');
  redirect('/workouts');
}
