'use client';

import { useState } from 'react';
import { WorkoutForm } from './WorkoutForm';
import { TemplateCard } from './TemplateCard';
import type { WorkoutTemplate } from '../app/workouts/page';

type TemplateProps = {
  initialTemplate: WorkoutTemplate[];
};

export const WorkoutTemplateGrid = ({ initialTemplate }: TemplateProps) => {
  const [showForm, setShowForm] = useState(false);
  const [templates, setTemplates] = useState(initialTemplate);

  if (showForm) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-black p-6">
          <button
            onClick={() => setShowForm(false)}
            className="float-right text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <WorkoutForm
            onSuccess={(newTemplate: WorkoutTemplate) => {
              setTemplates([newTemplate, ...templates]);
              setShowForm(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex h-full flex-col items-center justify-between">
        <h1 className="mb-3 text-2xl font-bold">Workout Templates</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Add New Workout
        </button>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </>
  );
};
