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

  // Create 3 friends for the leaderboard
  const friendsData = [
    { email: 'sarah.miller@example.com', name: 'Sarah Miller' },
    { email: 'mike.johnson@example.com', name: 'Mike Johnson' },
    { email: 'emma.wilson@example.com', name: 'Emma Wilson' },
  ];

  const friends = [];
  for (const friendData of friendsData) {
    const friend = await prisma.appUser.upsert({
      where: { email: friendData.email },
      update: { name: friendData.name },
      create: friendData,
    });
    friends.push(friend);
    console.log(`✅ Created/found friend: ${friend.name}`);
  }

  // Find or create Sled Push exercise for the challenge
  const sledPushExercise = await prisma.exercise.findFirst({
    where: { name: 'Sled Push' },
  });

  if (!sledPushExercise) {
    throw new Error('Sled Push exercise not found');
  }

  // Create this week's challenge
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  const challenge = await prisma.challenge.upsert({
    where: {
      id: 1,
    },
    update: {
      name: 'Fastest Sled Push',
      description: 'Complete a 50m sled push as fast as possible. May the best athlete win!',
      startDate: startOfWeek,
      endDate: endOfWeek,
      challengeType: 'TIME_TRIAL',
      targetExerciseId: sledPushExercise.id,
      targetValue: 50,
    },
    create: {
      name: 'Fastest Sled Push',
      description: 'Complete a 50m sled push as fast as possible. May the best athlete win!',
      startDate: startOfWeek,
      endDate: endOfWeek,
      challengeType: 'TIME_TRIAL',
      targetExerciseId: sledPushExercise.id,
      targetValue: 50,
    },
  });

  console.log('✅ Created/updated challenge: Fastest Sled Push');

  // Create leaderboard results with realistic times (in seconds)
  const leaderboardData = [
    { user: user1, time: 45.23, rank: 2 }, // You're in 2nd place
    { user: friends[0], time: 43.87, rank: 1 }, // Sarah is fastest
    { user: friends[1], time: 47.91, rank: 3 }, // Mike is 3rd
    { user: friends[2], time: 51.45, rank: 4 }, // Emma is 4th
  ];

  for (const entry of leaderboardData) {
    await prisma.challengeResult.upsert({
      where: {
        challengeId_userId: {
          challengeId: challenge.id,
          userId: entry.user.id,
        },
      },
      update: {
        resultValue: entry.time,
        rank: entry.rank,
      },
      create: {
        challengeId: challenge.id,
        userId: entry.user.id,
        resultValue: entry.time,
        rank: entry.rank,
      },
    });
    console.log(
      `✅ Created/updated result for ${entry.user.name}: ${entry.time}s (Rank: ${entry.rank})`
    );
  }

  const HyroxMonTemplate = await prisma.workoutTemplate.update({
    where: {
      id: 2,
    },
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

  const HyroxWedTemplate = await prisma.workoutTemplate.update({
    where: {
      id: 3,
    },
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

  const HyroxFriTemplate = await prisma.workoutTemplate.update({
    where: {
      id: 4,
    },
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

  const HyroxSimpleSession = await prisma.workoutTemplate.create({
    data: {
      name: 'Easy Hyrox session',
      targetRounds: 2,
      description: 'Simple session for testing',
      createdBy: user1.id,
      format: 'FOR_TIME',
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
            targetValue: 1000,
            targetUnit: 'meters',
            orderIndex: 2,
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
