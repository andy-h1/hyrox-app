import {
  Description,
  Field,
  Fieldset,
  Input,
  Legend,
  Label,
  Select,
  Switch,
} from '@headlessui/react';
import { useState } from 'react';

export const WorkoutForm = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <Fieldset>
      <Legend>Create a workout template to log your exercises</Legend>
      <Field>
        <Label>Workout name</Label>
        <Description>Choose a name </Description>
      </Field>
      <Input name="name" type="text" />
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
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
      </Switch>
    </Fieldset>
  );
};
