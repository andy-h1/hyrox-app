import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.appUser.upsert({
    where: { email: 'test-user@hyrox-local.app' },
    update: {},
    create: {
      email: 'test-user@hyrox-local.app',
      name: 'Test Useer',
    },
  });

  // Create exercises
  const exercises = [
    // Cardio
    { name: 'Run', category: 'cardio' },
    { name: 'Ski Erg', category: 'cardio' },
    { name: 'Row', category: 'cardio' },
    { name: 'Bike', category: 'cardio' },
    { name: 'Assault Bike', category: 'cardio' },

    // Strength
    { name: 'Sled Push', category: 'strength' },
    { name: 'Sled Pull', category: 'strength' },
    { name: 'Burpee Broad Jump', category: 'strength' },
    { name: 'Wall Balls', category: 'strength' },
    { name: 'Walking Lunges', category: 'strength' },
    { name: 'Farmers carry', category: 'strength' },

    // Additional Training Exercises
    { name: 'Back Squats', category: 'strength' },
    { name: 'Front Squats', category: 'strength' },
    { name: 'Bulgarian Split Squats', category: 'strength' },
    { name: 'Deadlifts', category: 'strength' },
    { name: 'Romanian Deadlifts', category: 'strength' },

    { name: 'Overhead Press', category: 'strength' },
    { name: 'Pull-ups', category: 'strength' },
    { name: 'Push-ups', category: 'strength' },
    { name: 'Sit-ups', category: 'strength' },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }

  console.log('Seed data created successfully');

  const HyroxMonTemplate = await prisma.workoutTemplate.create({
    data: {
      name: 'Hyrox station for Monday',
      targetRounds: 2,
      description: 'Complete 2 rounds',
      createdBy: user1.id,
      format: 'FOR_TIME',
      duration: 2700,
      isPublic: true,
      exercises: {
        create: [
          { exerciseId: 1, targetValue: 800, targetUnit: 'meters', orderIndex: 1 },
          { exerciseId: 2, targetValue: 500, targetUnit: 'meters', orderIndex: 2 },
          { exerciseId: 6, targetValue: 40, targetUnit: 'meters', orderIndex: 3 },
          { exerciseId: 7, targetValue: 40, targetUnit: 'meters', orderIndex: 4 },
        ],
      },
    },
  });

  const HyroxWedTemplate = await prisma.workoutTemplate.create({
    data: {
      name: 'Hyrox station for Wednesday',
      targetRounds: 2,
      description: 'Complete 2 rounds',
      createdBy: user1.id,
      format: 'FOR_TIME',
      duration: 1800,
      isPublic: true,
      exercises: {
        create: [
          {
            exerciseId: 1,
            targetValue: 1000,
            targetUnit: 'meters',
            orderIndex: 1,
          },
          {
            exerciseId: 3,
            targetValue: 750,
            targetUnit: 'meters',
            orderIndex: 2,
          },
          {
            exerciseId: 8,
            targetValue: 40,
            targetUnit: 'meters',
            orderIndex: 3,
          },
          {
            exerciseId: 11,
            targetValue: 150,
            targetUnit: 'meters',
            orderIndex: 4,
          },
        ],
      },
    },
  });

  const HyroxFriTemplate = await prisma.workoutTemplate.create({
    data: {
      name: 'Hyrox station for Friday',
      targetRounds: 2,
      description: 'Complete 2 rounds',
      createdBy: user1.id,
      format: 'FOR_TIME',
      duration: 1800,
      isPublic: true,
      exercises: {
        create: [
          {
            exerciseId: 2,
            targetValue: 250,
            targetUnit: 'meters',
            orderIndex: 1,
          },
          {
            exerciseId: 3,
            targetValue: 250,
            targetUnit: 'meters',
            orderIndex: 2,
          },
          {
            exerciseId: 9,
            targetValue: 20,
            targetUnit: 'reps',
            orderIndex: 3,
          },
          {
            exerciseId: 11,
            targetValue: 80,
            targetUnit: 'meters',
            orderIndex: 4,
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Template:
// 800m run -> 750m Row -> Burpee broad jumps 40m -> Farmers carry 150m
