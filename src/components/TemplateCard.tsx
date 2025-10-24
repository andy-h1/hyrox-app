import { formatDate } from '@/utils/timeAndDateUtils';
import { WorkoutTemplate } from '../app/workouts/page';

export const TemplateCard = ({ template }: { template: WorkoutTemplate }) => {
  const { id, name, description, format, exercises, creator, sharedWith, createdAt } = template;
  return (
    <div key={id} className="rounded-lg border p-4 hover:shadow-lg">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="mb-3 text-sm text-gray-600">{description}</p>

      {/* Format badge */}
      <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
        {format}
      </span>

      {/* Exercise count */}
      <div className="mt-3">
        <p className="text-sm font-medium">
          {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
        </p>
        <ul className="mt-1 text-sm text-gray-600">
          {exercises.slice(0, 5).map((ex) => (
            <li key={ex.id}>
              • {ex.name} {ex.targetValue} {ex.targetUnit}
            </li>
          ))}
          {exercises.length > 5 && <li className="text-gray-400">+{exercises.length - 5} more</li>}
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-4 border-t pt-3 text-xs text-gray-500">
        <p>By {creator.name}</p>
        <p>{formatDate(createdAt)}</p>
        {sharedWith.length > 0 && <p>Shared with {sharedWith.length} people</p>}
      </div>
    </div>
  );
};
