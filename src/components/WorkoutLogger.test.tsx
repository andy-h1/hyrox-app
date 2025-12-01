import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { WorkoutLogger } from './WorkoutLogger';

const mockTemplates = {
  exercises: [
    {
      id: 1,
      name: 'Run',
      category: 'cardio',
      targetValue: 'meters',
      targetUnit: '500',
    },
    {
      id: 2,
      name: 'Ski-erg',
      category: 'cardio',
      targetValue: 'meters',
      targetUnit: '500',
    },
  ],
  name: 'Test simulation',
  id: 1,
  description: 'Mock template for testing',
  isPublic: false,
  format: 'FOR_TIME',
  duration: 3600,
  targetRounds: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
  creator: {
    name: 'Andy',
    id: 1,
    email: 'test@hey.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    passwordHash: null,
    authUserId: null,
  },
};

describe('Workout Log Form', () => {
  it('should render', () => {
    const container = render(<WorkoutLogger templates={} />);
  });
});
