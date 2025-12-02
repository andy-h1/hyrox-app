import React from 'react';
import { Stopwatch } from './Stopwatch';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ExerciseTarget } from './Stopwatch';

const mockExercises: ExerciseTarget[] = [
  {
    id: 1,
    name: 'Push-ups',
    category: 'Upper Body',
    targetValue: 20,
    targetUnit: 'reps',
  },
  {
    id: 2,
    name: 'Squats',
    category: 'Lower Body',
    targetValue: 30,
    targetUnit: 'reps',
  },
  {
    id: 3,
    name: 'Plank',
    category: 'Core',
    targetValue: 60,
    targetUnit: 'seconds',
  },
];

const mockProps = {
  exercises: mockExercises,
  onFinish: vi.fn(),
  onBack: vi.fn(),
  targetRounds: 2,
};

describe('Stopwatch component', () => {
  it('should render with the initial state', () => {
    const { container } = render(<Stopwatch {...mockProps} />);

    expect(container).toMatchSnapshot();
  });
});
