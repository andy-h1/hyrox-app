import { Description, Field, Fieldset, Legend, Label } from './tailwind/fieldset';
import { Input } from './tailwind/input';
import { Select } from './tailwind/select';
import { Switch, SwitchField } from './tailwind/switch';
import { Checkbox, CheckboxField } from './tailwind/checkbox';
import { useState } from 'react';
import { createWorkoutTemplateAction } from '@/app/actions/workouts';
import { WorkoutTemplate } from '@/app/workouts/page';

type Exercise = {
  id: number;
  name: string;
  category: string;
};

type TemplateExercise = {
  exerciseId: number;
  targetValue: number;
  targetUnit: string;
  orderInIndex: number;
  notes: string;
};

type WorkoutFormProps = {
  onSuccess: (template: WorkoutTemplate) => void;
  exerciseList: Exercise[];
};

export const WorkoutForm = ({ onSuccess, exerciseList }: WorkoutFormProps) => {
  const [enabled, setEnabled] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<TemplateExercise[]>([]);

  const toggleExercise = (exerciseId: number) => {
    const exists = selectedExercises.find((ex) => ex.exerciseId === exerciseId);

    if (exists) {
      setSelectedExercises(selectedExercises.filter((ex) => ex.exerciseId !== exerciseId));
    } else {
      setSelectedExercises([
        ...selectedExercises,
        {
          exerciseId,
          targetValue: 0,
          targetUnit: '',
          orderInIndex: selectedExercises.length,
          notes: '',
        },
      ]);
    }
  };

  const updateExercise = (
    exerciseId: number,
    field: keyof TemplateExercise,
    value: string | number,
  ) => {
    setSelectedExercises(
      selectedExercises.map((ex) =>
        ex.exerciseId === exerciseId ? { ...ex, [field]: value } : ex,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.append('exercises', JSON.stringify(selectedExercises));

    const result = await createWorkoutTemplateAction(formData, 1); // TODO: Get real userId
    if (result?.success) {
      onSuccess(result.template);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset>
        <Legend>Create a workout template to log your exercises</Legend>
        <Field>
          <Label>Workout name</Label>
          <Description>Choose a name </Description>
          <Input name="name" type="text" required />
        </Field>
        <Field>
          <Label>Workout type</Label>
          <Description>Select the format of workout</Description>
          <Select name="format">
            <option>AMRAP</option>
            <option>For Time</option>
            <option>EMOM</option>
          </Select>
        </Field>
        <Field>
          <Label>Duration (minutes)</Label>
          <Description>Choose the duration of the workout</Description>
          <Input name="duration" type="number" required />
        </Field>
        <Field>
          <Label>Target rounds</Label>
          <Input name="targetRounds" type="number" />
        </Field>

        <SwitchField>
          <Label>Public workout</Label>
          <Switch name="isPublic" checked={enabled} onChange={setEnabled} />
        </SwitchField>

        {/* Exercise selection */}
        <Fieldset>
          <Legend>Select Exercises</Legend>
          <div className="space-y-4">
            {exerciseList.map((exercise) => (
              <div key={exercise.id}>
                <CheckboxField>
                  <Checkbox
                    checked={selectedExercises.some((ex) => ex.exerciseId === exercise.id)}
                    onChange={() => toggleExercise(exercise.id)}
                  />
                  <Label>{exercise.name}</Label>
                  <Description>{exercise.category}</Description>
                </CheckboxField>

                {/* Show inputs only if exercise is selected */}
                {selectedExercises.find((ex) => ex.exerciseId === exercise.id) && (
                  <div className="mt-2 ml-8 grid gap-3 border-l-2 border-gray-200 pl-4">
                    <Field>
                      <Label>Target Value</Label>
                      <Input
                        type="number"
                        value={
                          selectedExercises.find((ex) => ex.exerciseId === exercise.id)?.targetValue
                        }
                        onChange={(e) => updateExercise(exercise.id, 'targetValue', e.target.value)}
                      />
                    </Field>

                    <Field>
                      <Label>Unit</Label>
                      <Select
                        value={
                          selectedExercises.find((ex) => ex.exerciseId === exercise.id)?.targetUnit
                        }
                        onChange={(e) => updateExercise(exercise.id, 'targetUnit', e.target.value)}
                      >
                        <option>reps</option>
                        <option>calories</option>
                        <option>meters</option>
                        <option>seconds</option>
                      </Select>
                    </Field>

                    <Field>
                      <Label>Notes (optional)</Label>
                      <Input
                        type="text"
                        value={selectedExercises.find((ex) => ex.exerciseId === exercise.id)?.notes}
                        onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)}
                      />
                    </Field>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Fieldset>

        <button type="submit" className="mt-6 rounded bg-blue-500 px-4 py-2 text-white">
          Create Template
        </button>
      </Fieldset>
    </form>
  );
};
