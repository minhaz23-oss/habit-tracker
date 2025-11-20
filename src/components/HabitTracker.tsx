import React, { useState, useEffect } from 'react';
import type { Habit, HabitCompletion, HabitData } from '../types';
import { loadHabitData, saveHabitData } from '../storage';
import { calculateMonthStats, getMonthName } from '../utils';
import { HabitGrid } from './HabitGrid';
import { AddHabitForm } from './AddHabitForm';
import { Statistics } from './Statistics';
import { ProgressChart } from './ProgressChart';

export const HabitTracker: React.FC = () => {
  const [habitData, setHabitData] = useState<HabitData>(() => loadHabitData());
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveHabitData(habitData);
  }, [habitData]);

  const handleAddHabit = (name: string) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      createdAt: new Date().toISOString()
    };
    setHabitData((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit]
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit? This will also remove all completion data.')) {
      setHabitData((prev) => ({
        habits: prev.habits.filter((h) => h.id !== habitId),
        completions: prev.completions.filter((c) => c.habitId !== habitId)
      }));
    }
  };

  const handleToggleCompletion = (habitId: string, date: string) => {
    setHabitData((prev) => {
      const existingIndex = prev.completions.findIndex(
        (c) => c.habitId === habitId && c.date === date
      );

      if (existingIndex >= 0) {
        // Remove completion
        return {
          ...prev,
          completions: prev.completions.filter((_, i) => i !== existingIndex)
        };
      } else {
        // Add completion
        const newCompletion: HabitCompletion = { habitId, date };
        return {
          ...prev,
          completions: [...prev.completions, newCompletion]
        };
      }
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const stats = calculateMonthStats(year, month, habitData.habits, habitData.completions);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 print:bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Habit Tracker</h1>
          <p className="text-gray-600">Track your daily habits and build consistency</p>
        </div>

        {/* Month Navigation */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousMonth}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              ← Previous
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {getMonthName(month)} {year}
              </h2>
              {!isCurrentMonth && (
                <button
                  onClick={handleToday}
                  className="mt-1 text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Go to current month
                </button>
              )}
            </div>

            <button
              onClick={handleNextMonth}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Statistics */}
        {habitData.habits.length > 0 && <Statistics stats={stats} />}

        {/* Add Habit Form */}
        <AddHabitForm onAddHabit={handleAddHabit} />

        {/* Habit Grid */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 overflow-hidden">
          <HabitGrid
            habits={habitData.habits}
            completions={habitData.completions}
            year={year}
            month={month}
            onToggleCompletion={handleToggleCompletion}
            onDeleteHabit={handleDeleteHabit}
          />
        </div>

        {/* Progress Chart */}
        <ProgressChart
          habits={habitData.habits}
          completions={habitData.completions}
          year={year}
          month={month}
        />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 print:hidden">
          <p>Data is automatically saved to your browser's local storage</p>
        </div>
      </div>
    </div>
  );
};
