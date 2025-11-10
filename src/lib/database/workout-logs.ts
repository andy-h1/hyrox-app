import { success } from 'zod';
import { prisma } from '../prisma';

type LogWorkoutData = {
  userId: number;
  templateId: number;
  laps: [
    {
      name: string;
      type: 'exercise' | 'rest';
      duration: number; //milliseconds
      exerciseId?: number;
    },
  ];
};

export async function createWorkoutLog(data: LogWorkoutData) {
  const { userId, templateId, laps } = data;

  const exerciseLaps = laps.filter((l) => l.type === 'exercise');
  const restLaps = laps.filter((l) => l.type === 'rest');

  const totalWorkTime = Math.floor(exerciseLaps.reduce((acc, lap) => acc + lap.duration, 0));
  const totalRestTime = Math.floor(restLaps.reduce((acc, lap) => acc + lap.duration, 0));
  const totalDuration = totalWorkTime + totalRestTime;

  try {
    const workoutLog = await prisma.$transaction(async (tx) => {
      const log = await tx.workoutLog.create({
        data: {
          userId,
          templateId,
          completedAt: new Date(),
          roundsCompleted: exerciseLaps.length,
          totalDuration,
          totalRestTime,
          totalWorkTime,
          status: 'COMPLETED',
        },
      });

      let currentRound = 1;

      for (const lap of exerciseLaps) {
        const lapIndex = laps.indexOf(lap);
        const restAfter =
          laps[lapIndex + 1]?.type === 'rest'
            ? Math.floor(laps[lapIndex + 1].duration / 1000)
            : null;

        const round = await tx.workoutRound.create({
          data: {
            logId: log.id,
            roundNumber: currentRound,
            startedAt: new Date(),
            completedAt: new Date(),
            duration: Math.floor(lap.duration),
            restAfter,
          },
        });

        if (lap.exerciseId) {
          await tx.roundExercise.create({
            data: {
              roundId: round.id,
              exerciseId: lap.exerciseId,
              startedAt: new Date(),
              completedAt: new Date(),
              duration: Math.floor(lap.duration / 1000),
              actualValue: 0, //TODO: Capture actual reps/distance,
              actualUnit: 'reps', //TODO: Get from lap data,
              scaled: false,
            },
          });
        }

        currentRound++;
      }

      return log;
    });
    return { success: true, workoutLog };
  } catch (error) {
    console.error('Error creating workout log:', error);
    throw error;
  }
}
