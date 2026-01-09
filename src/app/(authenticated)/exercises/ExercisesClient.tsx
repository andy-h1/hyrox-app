'use client';

import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

type Exercise = {
  id: number;
  name: string;
  category: string;
};

type ExercisesClientProps = {
  exercises: Exercise[];
};

export default function ExercisesClient({ exercises }: ExercisesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(exercises.map((ex) => ex.category)));
    return ['all', ...uniqueCategories.sort()];
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchQuery, selectedCategory]);

  const exercisesByCategory = useMemo(() => {
    const grouped: Record<string, Exercise[]> = {};
    filteredExercises.forEach((exercise) => {
      if (!grouped[exercise.category]) {
        grouped[exercise.category] = [];
      }
      grouped[exercise.category].push(exercise);
    });
    return grouped;
  }, [filteredExercises]);

  const sortedCategories = Object.keys(exercisesByCategory).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-950/10 bg-white py-2 pr-4 pl-10 text-sm text-zinc-950 placeholder-zinc-500 focus:border-zinc-950/20 focus:ring-2 focus:ring-zinc-950/5 focus:outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-400 dark:focus:border-white/20 dark:focus:ring-white/5"
          />
        </div>

        <div className="relative sm:w-64">
          <FunnelIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none rounded-lg border border-zinc-950/10 bg-white py-2 pr-10 pl-10 text-sm text-zinc-950 focus:border-zinc-950/20 focus:ring-2 focus:ring-zinc-950/5 focus:outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:focus:border-white/20 dark:focus:ring-white/5"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : capitalizeFirstLetter(category)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing {filteredExercises.length} of {exercises.length} exercises
      </div>

      {filteredExercises.length === 0 ? (
        <div className="rounded-lg border border-zinc-950/10 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-900">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">
            No exercises found
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedCategories.map((category) => (
            <div key={category}>
              <h2 className="mb-4 text-xl font-semibold text-zinc-950 dark:text-white">
                {capitalizeFirstLetter(category)}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {exercisesByCategory[category].map((exercise) => (
                  <div
                    key={exercise.id}
                    className="group rounded-lg border border-zinc-950/10 bg-white p-4 transition-all hover:border-zinc-950/20 hover:shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-zinc-950 dark:text-white">{exercise.name}</h3>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {capitalizeFirstLetter(exercise.category)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
