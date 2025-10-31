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
import { createWorkoutTemplateAction } from '@/app/actions/workouts';

export const WorkoutForm = ({ onSuccess }) => {
  const [enabled, setEnabled] = useState(false);

  const handleSubmit = async (formData: FormData, userId) => {
    const result = await createWorkoutTemplateAction(formData, userId);
    if (result.success) {
      onSuccess(result.template);
    }
  };
  return (
    <Fieldset className="space-y-12 rounded-md border-b border-gray-900/10 bg-white p-4 pb-12">
      <Legend as="div" className="font-semibold text-gray-900">
        Create a workout template to log your exercises
      </Legend>
      <Field>
        <Label className="block text-base font-medium text-gray-900">Workout name</Label>
        <Description className="block text-sm/6 font-medium text-gray-700">
          Choose a name{' '}
        </Description>
      </Field>
      <input
        name="name"
        type="text"
        className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
      />
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
