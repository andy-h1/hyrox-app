'use client';

import type { WorkoutTemplate } from '@/app/workouts/page';
import { TemplateCard } from './TemplateCard';
import { useState } from 'react';
import { ExerciseLog } from './ExerciseLog';
import { Stopwatch } from './Stopwatch';
import { Button } from './tailwind/button';

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
          <div key={template.id} className="flex flex-col justify-center gap-3">
            <TemplateCard template={template} />
            <Button type="button" onClick={() => setSelectedTemplate(template)}>
              Select workout
            </Button>
          </div>
        ))}
      </div>

      {selectedTemplate && <ExerciseLog template={selectedTemplate} />}
    </>
  );
};
