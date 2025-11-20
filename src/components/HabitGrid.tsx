import React from 'react';
import type { Habit, HabitCompletion } from '../types';
import { formatDate, getDaysInMonth, isHabitCompleted } from '../utils';

interface HabitGridProps {
  habits: Habit[];
  completions: HabitCompletion[];
  year: number;
  month: number;
  onToggleCompletion: (habitId: string, date: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitGrid: React.FC<HabitGridProps> = ({
  habits,
  completions,
  year,
  month,
  onToggleCompletion,
  onDeleteHabit
}) => {
  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDay = isCurrentMonth ? today.getDate() : null;

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No habits yet. Add your first habit to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Header with day numbers */}
        <div className="flex border-b-2 border-gray-300 bg-gray-50">
          <div className="w-48 flex-shrink-0 p-3 font-semibold text-gray-700 border-r-2 border-gray-300">
            Habit
          </div>
          {days.map(day => (
            <div
              key={day}
              className={`w-10 flex-shrink-0 p-2 text-center text-sm font-medium border-r border-gray-200 ${
                day === currentDay ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
          <div className="w-12 flex-shrink-0 p-2 text-center text-sm font-medium text-gray-600">
            ×
          </div>
        </div>

        {/* Habit rows */}
        {habits.map((habit) => (
          <div key={habit.id} className="flex border-b border-gray-200 hover:bg-gray-50">
            <div className="w-48 flex-shrink-0 p-3 font-medium text-gray-800 border-r border-gray-200 truncate">
              {habit.name}
            </div>
            {days.map(day => {
              const dateStr = formatDate(year, month, day);
              const completed = isHabitCompleted(habit.id, dateStr, completions);
              
              return (
                <div
                  key={day}
                  className={`w-10 flex-shrink-0 p-2 flex items-center justify-center border-r border-gray-200 ${
                    day === currentDay ? 'bg-blue-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => onToggleCompletion(habit.id, dateStr)}
                    className="w-5 h-5 cursor-pointer accent-green-600 rounded"
                  />
                </div>
              );
            })}
            <div className="w-12 flex-shrink-0 p-2 flex items-center justify-center border-l border-gray-200">
              <button
                onClick={() => onDeleteHabit(habit.id)}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
                title="Delete habit"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
