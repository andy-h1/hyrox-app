'use client';

import { useState } from 'react';
import type { WorkoutTemplate } from '@/app/(authenticated)/workouts/page';
import { Stopwatch } from './Stopwatch';
import { WorkoutReview } from './WorkoutReview';
import type { Lap } from './Stopwatch';
import { saveWorkoutAction } from '@/app/(authenticated)/dashboard/log-workout/actions';

enum format {
  'FOR_TIME' = 'For time',
  'AMRAP' = 'As many reps as possible',
  'EMOM' = 'Every minute on the minute',
}

type ExerciseLogProps = {
  template: WorkoutTemplate;
  onBack: () => void;
};

export const ExerciseLog = ({ template, onBack }: ExerciseLogProps) => {
  const [step, setStep] = useState<'workout' | 'review'>('workout');
  const [laps, setLaps] = useState<Lap[]>([]);

  const handleFinishWorkout = (completedLaps: Lap[]) => {
    setLaps(completedLaps);
    setStep('review');
  };

  const handleBackToWorkout = () => {
    setStep('workout');
  };

  const handleSaveWorkout = async (editedLaps: Lap[]) => {
    const formData = new FormData();
    formData.append('templateId', template.id.toString());
    formData.append('laps', JSON.stringify(editedLaps));
    formData.append('workoutStartTime', editedLaps[0]?.startedAt.toISOString() || '');
    formData.append(
      'workoutEndTime',
      editedLaps[editedLaps.length - 1]?.completedAt.toISOString() || '',
    );

    await saveWorkoutAction(formData);
  };

  if (step === 'review') {
    return <WorkoutReview laps={laps} onSave={handleSaveWorkout} onBack={handleBackToWorkout} />;
  }

  return (
    <Stopwatch
      exercises={template.exercises}
      onFinish={handleFinishWorkout}
      onBack={onBack}
      targetRounds={template.targetRounds || 1}
    />
  );
};

// TODO: When user clicks on workout we need to show the exercises they need to do
// the target distance/reps
// the target weight
// When user starts the workout it should start timer on the first exercise and show what exercise they are currently doing
// When user clicks finish workout it should log that workout and move to rest time
// When user clicks next exercise it should stop rest time and move to next exercise

// NOTE: Make a simpler workout to test
// Get the functionality working first before cleaning up the CSS
