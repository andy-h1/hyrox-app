import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getExercisesList() {
  const allExercises = await prisma.exercise.findMany({
    select: {
      id: true,
      name: true,
      category: true,
    },
  });
  return allExercises;
}
