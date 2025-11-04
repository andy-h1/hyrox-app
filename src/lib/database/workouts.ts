import type { WorkoutTemplate } from '@prisma/client';
import type { TemplateExercise } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { getCurrentUser } from '../auth-server';

type WorkoutData = {
  name: string;
  description?: string;
  format: string;
  duration?: number;
  targetRounds?: number;
  isPublic: boolean;
  exercises: [
    {
      exerciseId: number;
      targetValue: number;
      targetUnit: string;
      orderInIndex: number;
      notes?: string;
    },
  ];
};

export async function getLoggedWorkouts() {
  try {
    const workoutLogs = await prisma.workoutLog.findMany({
      select: {
        id: true,
        roundsCompleted: true,
        totalDuration: true,
        totalWorkTime: true,
        totalRestTime: true,
        status: true,
        notes: true,
      },
    });

    return workoutLogs;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getWorkoutTemplates() {
  try {
    const workoutTemplates = await prisma.workoutTemplate.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isPublic: true,
        format: true,
        duration: true,
        targetRounds: true,
        createdAt: true,
        updatedAt: true,
        exercises: {
          select: {
            targetValue: true,
            targetUnit: true,
            exercise: true,
          },
        },
        creator: true,
        sharedWith: {
          select: {
            user: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return workoutTemplates.map((template) => ({
      ...template,
      exercises: template.exercises.map((e) => ({
        id: e.exercise.id,
        name: e.exercise.name,
        category: e.exercise.category,
        targetValue: e.targetValue,
        targetUnit: e.targetUnit,
      })),
      sharedWith: template.sharedWith.map((shared) => shared.user),
    }));
  } catch (error) {
    // Look at adding PrismaClient errors
    console.error('Error fetching workout templates:', error);
    throw new Error('Unknown error');
  }
}

export async function createWorkoutTemplate(workoutData: WorkoutData) {
  const user = await getCurrentUser();
  if (!user) throw Error('Unauthorised');

  try {
    const newWorkoutTemplate = await prisma.$transaction(async (tx) => {
      // tables that need to be updated are: WorkoutTemplate / TemplateExercise / TemplateShare?
      const template = await tx.workoutTemplate.create({
        data: {
          createdBy: user.id,
          name: workoutData.name,
          description: workoutData.description,
          isPublic: workoutData.isPublic,
          format: workoutData.format,
          duration: workoutData.duration ?? undefined,
          targetRounds: workoutData.targetRounds ?? undefined,
        },
      });

      await Promise.all(
        workoutData.exercises.map((exercise) => {
          tx.templateExercise.create({
            data: {
              templateId: template.id,
              exerciseId: exercise.exerciseId,
              targetValue: exercise.targetValue,
              targetUnit: exercise.targetUnit,
              orderIndex: exercise.orderInIndex,
            },
          });
        }),
      );

      return template;
    });

    return { success: true, template: newWorkoutTemplate };
  } catch (error) {
    console.error('Error creating new workout templates', error);
  }
}
