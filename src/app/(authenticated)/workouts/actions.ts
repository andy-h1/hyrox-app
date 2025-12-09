'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createWorkoutTemplate } from '@/lib/database/workouts';

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
  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    format: formData.get('format') as 'AMRAP' | 'FOR_TIME' | 'EMOM',
    duration: formData.get('duration') ? Number(formData.get('duration')) : undefined,
    targetRounds: formData.get('targetRounds') ? Number(formData.get('targetRounds')) : undefined,
    isPublic: formData.get('isPublic') === 'true',
    exercises: JSON.parse(formData.get('exercises') as string),
  };

  const validatedData = workoutDataSchema.parse(rawData);

  const template = await createWorkoutTemplate({
    ...validatedData,
    exercises: validatedData.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      targetValue: ex.targetValue,
      targetUnit: ex.targetUnit,
      orderInIndex: ex.orderIndex,
      notes: ex.notes,
    })),
  });

  revalidatePath('/workouts');

  return { success: true, template };
}
