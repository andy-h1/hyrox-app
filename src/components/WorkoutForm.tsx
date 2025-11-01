import { Description, Field, Fieldset, Legend, Label } from './tailwind/fieldset';
import { Input } from './tailwind/input';
import { Select } from './tailwind/select';
import { Switch, SwitchField } from './tailwind/switch';
import { useState } from 'react';
import { createWorkoutTemplateAction } from '@/app/actions/workouts';

export const WorkoutForm = ({ onSuccess, exerciseList }) => {
  const [enabled, setEnabled] = useState(false);

  const handleSubmit = async (formData: FormData, userId: number) => {
    const result = await createWorkoutTemplateAction(formData, userId);
    console.log({ result });
    if (result.success) {
      onSuccess(result.template);
    }
  };

  return (
    <Fieldset>
      <Legend>Create a workout template to log your exercises</Legend>
      <Field>
        <Label>Workout name</Label>
        <Description>Choose a name </Description>
        <Input name="name" type="text" />
      </Field>
      <Field>
        <Label>Workout type</Label>
        <Description>Select the format of workout</Description>
        <Select name="format">
          <option>AMRAP</option>
          <option>For Time</option>
          <option>EMOM</option>
          <option>Intervals</option>
        </Select>
      </Field>
      <Field>
        <Label>Workout duration</Label>
        <Description>Choose the duration of the workout</Description>
        <Input name="duration" type="number" />
      </Field>
      <Field>
        <Label>Target rounds</Label>
        <Description>Choose the number of rounds of the workout</Description>
        <Input name="duration" type="number" />
      </Field>
      <SwitchField>
        <Label>Workout public</Label>
        <Description>Makes your workout available to the public</Description>
        <Switch name="isPublic" checked={enabled} onChange={setEnabled} />
      </SwitchField>
    </Fieldset>
  );
};
