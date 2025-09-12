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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createWorkout(workoutData: any, userId: number) {
  const { name, type, notes, exercises } = workoutData;

  // Step 1: Create the workout
  const newWorkout = await prisma.workout.create({
    data: {
      userId,
      date: new Date(),
      type,
      notes,
    },
  });

  // Step 2: Create workout exercises
  for (const exercise of exercises) {
    await prisma.workoutExercise.create({
      data: {
        workoutId: newWorkout.id,
        exerciseId: exercise.exerciseId,
        value: exercise.value,
        timeTaken: exercise.timeTaken,
        orderInWorkout: exercise.orderInWorkout,
      },
    });
  }

  return newWorkout;
}
