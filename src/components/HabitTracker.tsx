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
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveHabitData(habitData);
  }, [habitData]);

  // Handle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

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

  const handleUpdateStatus = (habitId: string, date: string, newStatus: 'none' | 'completed' | 'failed') => {
    setHabitData((prev) => {
      const existingIndex = prev.completions.findIndex(
        (c) => c.habitId === habitId && c.date === date
      );

      if (newStatus === 'none') {
        // Remove completion if it exists
        if (existingIndex !== -1) {
          return {
            ...prev,
            completions: prev.completions.filter((_, i) => i !== existingIndex)
          };
        }
        return prev;
      }

      // Add or Update
      const newCompletion: HabitCompletion = { habitId, date, status: newStatus };

      if (existingIndex !== -1) {
        // Update existing
        const updatedCompletions = [...prev.completions];
        updatedCompletions[existingIndex] = newCompletion;
        return {
          ...prev,
          completions: updatedCompletions
        };
      } else {
        // Add new
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
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans py-12 px-4 sm:px-6 lg:px-8 print:bg-white transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="relative text-center space-y-4">
          <div className="absolute right-0 top-0">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent pb-1">
            Habit Tracker
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Build consistency and track your progress with a simple, focused interface.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
            <button
              onClick={handlePreviousMonth}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-all"
              aria-label="Previous month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="px-6 py-1 text-center min-w-[200px]">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getMonthName(month)} {year}
              </h2>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-all"
              aria-label="Next month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {!isCurrentMonth && (
            <button
              onClick={handleToday}
              className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Jump to Today
            </button>
          )}
        </div>

        {/* Statistics */}
        {habitData.habits.length > 0 && <Statistics stats={stats} />}

        {/* Add Habit Form */}
        <AddHabitForm onAddHabit={handleAddHabit} />

        {/* Habit Grid */}
        <div className="mb-6">
          <HabitGrid
            habits={habitData.habits}
            completions={habitData.completions}
            year={year}
            month={month}
            onUpdateStatus={handleUpdateStatus}
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
