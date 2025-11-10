'use client';

import type { WorkoutTemplate } from '@/app/workouts/page';
import { TemplateCard } from './TemplateCard';
import { useState } from 'react';
import { ExerciseLog } from './ExerciseLog';
import { Button } from './tailwind/button';

type WorkoutLoggerProps = {
  templates: WorkoutTemplate[];
};

export const WorkoutLogger = ({ templates }: WorkoutLoggerProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate>();
  const [loggerStep, setLoggerStep] = useState(0);

  console.log({ templates });

  console.log(selectedTemplate);

  const handleSelectedTemplate = (template) => {
    setSelectedTemplate(template);
    setLoggerStep(1);
    return loggerStep;
  };

  return (
    <>
      {!selectedTemplate && loggerStep === 0 && (
        <>
          <h1>Let&apos;s get it! Choose your workout from the list below</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div key={template.id} className="flex flex-col justify-center gap-3">
                <TemplateCard template={template} />
                <Button type="button" onClick={() => handleSelectedTemplate(template)}>
                  Select workout
                </Button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedTemplate && loggerStep === 1 && <ExerciseLog template={selectedTemplate} />}
    </>
  );
};
