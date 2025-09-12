import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getExercises() {
  const allExercises = await prisma.exercise.findMany({
    select: {
      id: true,
      name: true,
      unit: true,
      category: true,
      optimization: true,
    },
  });
  return allExercises;
}
