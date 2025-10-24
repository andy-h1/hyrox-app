'use client';

import type { WorkoutTemplate } from '@/app/workouts/page';
import { TemplateCard } from './TemplateCard';
import { useState } from 'react';
import { ExerciseLog } from './ExerciseLog';
import { Stopwatch } from './Stopwatch';

type WorkoutLoggerProps = {
  templates: WorkoutTemplate[];
};

export const WorkoutLogger = ({ templates }: WorkoutLoggerProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate>();

  console.log(selectedTemplate);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div key={template.id}>
            <TemplateCard template={template} />
            <button type="button" onClick={() => setSelectedTemplate(template)}>
              Select workout
            </button>
          </div>
        ))}
      </div>

      {selectedTemplate && <ExerciseLog template={selectedTemplate} />}
    </>
  );
};
