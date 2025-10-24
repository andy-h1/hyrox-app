import { WorkoutTemplate } from '@prisma/client';
import { prisma } from '../../lib/prisma';

//TODO: fix type for workoutData

// export async function createWorkout(workoutData: any, userId: number) {
//   const { name, type, notes, exercises } = workoutData;

//   const formatType = type === 'forTraining' ? 'FOR_TRAINING' : 'HYROX_SIM';

//   try {
//     console.log('Creating workout for user:', userId, 'with data:', workoutData);
//     await prisma.$transaction(async (tx) => {
//       // Step 1: Create the workout
//       const newWorkout = await tx.workout.create({
//         data: {
//           userId,
//           date: new Date(),
//           type: formatType,
//           notes,
//         },
//       });

//       console.log('Workout DB entry created:', newWorkout);

//       for (const exercise of exercises) {
//         console.log(
//           'Creating workoutExercise for workoutId:',
//           newWorkout.id,
//           'exercise:',
//           exercise,
//         );
//         await tx.workoutExercise.create({
//           data: {
//             workoutId: newWorkout.id,
//             exerciseId: parseFloat(exercise.exerciseId),
//             value: parseFloat(exercise.value),
//             timeTaken: parseFloat(exercise.timeTaken),
//             orderInWorkout: parseFloat(exercise.orderInWorkout),
//           },
//         });
//       }
//       console.log('All workout exercises created for workoutId:', newWorkout.id);
//       return { message: 'Workout logged successfully', newWorkout };
//     });
//   } catch (error) {
//     console.error('Error in createWorkout:', error);
//     throw error; // Rethrow so the route handler can catch and respond
//   }
// }
// // Note: Does my database structure make sense?!

// export async function getWorkoutTemplates() {
//   try {
//     const workoutTemplates = await prisma.workoutTemplate.findMany({
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         createdBy: true,
//         format: true,
//         duration: true,
//         targetRounds: true,
//       },
//     });

//     return workoutTemplates;
//   } catch (error) {
//     throw new Error(error instanceof Error ? error.message : 'Unknown error');
//   }
// }

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

export async function createWorkoutTemplate(workoutData, userId) {
  try {
    await prisma.$transaction(async (tx) => {
      // tables that need to be updated are: WorkoutTemplate / TemplateExercise / TemplateShare?
      const newWorkoutTemplate = await tx.workoutTemplate.create({
        data: {
          createdBy: userId,
          name: workoutData.name,
          description: workoutData.description,
          isPublic: workoutData.isPublic,
          format: workoutData.format,
          duration: workoutData.duration ?? undefined,
          targetRounds: workoutData.targetRounds ?? undefined,
        },
      });

      const selectedExercises = workoutData.exercise;

      // for each exercise - create a new template exercise row
      selectedExercises.forEach(async (exercise) => {
        await tx.templateExercise.create({
          data: {
            templateId: newWorkoutTemplate.id,
            exerciseId: exercise.id,
            targetValue: exercise.targetValue,
            targetUnit: exercise.targetUnit,
            orderIndex: exercise.orderIndex,
          },
        });
      });
    });
  } catch (error) {
    console.error('Error creating new workout templates', error);
  }
}
