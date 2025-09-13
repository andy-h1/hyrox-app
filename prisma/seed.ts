import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create exercises
  const exercises = [
    // Cardio
    { name: 'Run', unit: 'meters', category: 'cardio', optimization: 'MIN' },
    {
      name: 'Ski Erg',
      unit: 'meters',
      category: 'cardio',
      optimization: 'MIN',
    },
    { name: 'Row', unit: 'meters', category: 'cardio', optimization: 'MIN' },
    { name: 'Bike', unit: 'meters', category: 'cardio', optimization: 'MIN' },

    // Strength
    {
      name: 'Sled Push',
      unit: 'meters',
      category: 'strength',
      optimization: 'MIN',
    },
    {
      name: 'Sled Pull',
      unit: 'meters',
      category: 'strength',
      optimization: 'MIN',
    },
    {
      name: 'Burpee Broad Jump',
      unit: 'reps',
      category: 'strength',
      optimization: 'MIN',
    },
    {
      name: 'Wall Balls',
      unit: 'reps',
      category: 'strength',
      optimization: 'MAX',
    },
    { name: 'Lunges', unit: 'reps', category: 'strength', optimization: 'MAX' },

    // Additional Training Exercises
    { name: 'Squats', unit: 'reps', category: 'strength', optimization: 'MAX' },
    {
      name: 'Overhead Press',
      unit: 'reps',
      category: 'strength',
      optimization: 'MAX',
    },
    {
      name: 'Pull-ups',
      unit: 'reps',
      category: 'strength',
      optimization: 'MAX',
    },
    {
      name: 'Push-ups',
      unit: 'reps',
      category: 'strength',
      optimization: 'MAX',
    },
    {
      name: 'Sit-ups',
      unit: 'reps',
      category: 'strength',
      optimization: 'MAX',
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
