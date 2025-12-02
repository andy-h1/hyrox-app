import React from 'react';
import { Stopwatch } from './Stopwatch';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
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
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  it('should render with the initial state', () => {
    const { container } = render(<Stopwatch {...mockProps} />);

    const h2 = screen.getByRole('heading', { level: 2, name: /push-ups/i });
    const h3 = screen.getByRole('heading', { level: 3, name: /squats/i });

    expect(container).toMatchSnapshot();
    expect(h2).toBeDefined();
    expect(h3).toBeDefined();
  });

  it('should start and pause the timer when the user clicks the button', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Stopwatch {...mockProps} />);

    const startButton = screen.getByRole('button', { name: /start/i });
    await user.click(startButton);

    vi.advanceTimersByTime(1500);

    const pauseButton = screen.getByRole('button', { name: /pause/i });
    await user.click(pauseButton);

    expect(screen.getByRole('timer')).toBe('00:01:50');
  });
});
