import { Description, Field, Fieldset, Legend, Label } from './tailwind/fieldset';
import { Input } from './tailwind/input';
import { Select } from './tailwind/select';
import { Switch, SwitchField } from './tailwind/switch';
import { Checkbox, CheckboxField } from './tailwind/checkbox';
import { useState } from 'react';
import { createWorkoutTemplateAction } from '@/app/workouts/actions';
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

    const result = await createWorkoutTemplateAction(formData);
    if (result?.success) {
      onSuccess(result.template);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset className="grid gap-6 rounded-md bg-white p-4 md:grid-cols-1 lg:grid-cols-2">
        <Legend className="col-span-4">Create a workout template to log your exercises</Legend>
        <Field className="md:col-span-1 lg:col-span-2">
          <Label>Workout name</Label>
          <Description>Choose a name </Description>
          <Input name="name" type="text" required />
        </Field>
        <Field className="md:col-span-1 lg:col-span-2">
          <Label>Workout type</Label>
          <Description>Select the format of workout</Description>
          <Select name="format">
            <option>AMRAP</option>
            <option>For Time</option>
            <option>EMOM</option>
          </Select>
        </Field>
        <Field className="md:col-span-1 lg:col-span-2">
          <Label>Duration (minutes)</Label>
          <Description>Choose the duration of the workout</Description>
          <Input name="duration" type="number" />
        </Field>
        <Field className="md:col-span-1 lg:col-span-2">
          <Label>Target rounds</Label>
          <Description>Choose number of rounds for the workout</Description>
          <Input name="targetRounds" type="number" />
        </Field>

        {/* Exercise selection */}
        <Fieldset className="col-span-2">
          <Legend className="mb-2">Select Exercises</Legend>
          <div className="space-y-4">
            {exerciseList.map((exercise) => (
              <div key={exercise.id} className="md:col-span-1 lg:col-span-4">
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

        <SwitchField className="col-span-4">
          <Description>Choose if you want this workout available to the public</Description>
          <Label>Public workout</Label>
          <Switch name="isPublic" checked={enabled} onChange={setEnabled} />
        </SwitchField>

        <button type="submit" className="col-span-4 mt-6 rounded bg-blue-500 px-4 py-2 text-white">
          Create Template
        </button>
      </Fieldset>
    </form>
  );
};
