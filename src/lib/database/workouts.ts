import { prisma } from '../prisma';
import { getCurrentUser } from '../auth-server';

type WorkoutData = {
  name: string;
  description?: string;
  format: string;
  duration?: number;
  targetRounds?: number;
  isPublic: boolean;
  exercises: Array<{
    exerciseId: number;
    targetValue: number;
    targetUnit: string;
    orderInIndex: number;
    notes?: string;
  }>;
};

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
            orderIndex: true,
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

    const completeTemplate = await prisma.workoutTemplate.findUnique({
      where: { id: newWorkoutTemplate.id },
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
            orderIndex: true,
          },
        },
        creator: true,
        sharedWith: {
          select: {
            user: true,
          },
        },
      },
    });

    if (!completeTemplate) {
      throw new Error('Failed to fetch created template');
    }

    const formattedTemplate = {
      ...completeTemplate,
      exercises: completeTemplate.exercises.map((e) => ({
        id: e.exercise.id,
        name: e.exercise.name,
        category: e.exercise.category,
        targetValue: e.targetValue,
        targetUnit: e.targetUnit,
      })),
      sharedWith: completeTemplate.sharedWith.map((shared) => shared.user),
    };

    return formattedTemplate;
  } catch (error) {
    console.error('Error creating new workout templates', error);
    throw error;
  }
}

export async function getLoggedWorkouts() {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const workoutLogs = await prisma.workoutLog.findMany({
      where: {
        userId: user.id,
      },
      include: {
        template: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: {
                orderIndex: 'asc',
              },
            },
          },
        },
        rounds: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: {
                startedAt: 'asc',
              },
            },
          },
          orderBy: {
            roundNumber: 'asc',
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: 10,
    });

    return workoutLogs;
  } catch (error) {
    console.error('Error fetching logged workouts:', error);
    return [];
  }
}
