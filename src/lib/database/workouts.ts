import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockWorkoutData = {
  name: '1k run',
  type: 'FOR_TRAINING',
  notes: 'quick session',
  exercises: [
    {
      exerciseId: 1,
      value: 1000,
      timeTaken: 270,
      orderInWorkout: 1,
    },
    {
      exerciseId: 8,
      value: 50,
      timeTaken: 135,
      orderInWorkout: 2,
    },
  ],
};

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
