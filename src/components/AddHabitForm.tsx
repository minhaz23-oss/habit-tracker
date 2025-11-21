import React, { useState } from 'react';

interface AddHabitFormProps {
  onAddHabit: (name: string) => void;
}

export const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAddHabit }) => {
  const [habitName, setHabitName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit(habitName.trim());
      setHabitName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Add a new habit..."
          className="block w-full pl-11 pr-32 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent sm:text-sm sm:leading-6 shadow-sm transition-all"
          maxLength={50}
        />
        <div className="absolute inset-y-0 right-0 flex py-2 pr-2">
          <button
            type="submit"
            disabled={!habitName.trim()}
            className="px-4 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Add Habit
          </button>
        </div>
      </div>
    </form>
  );
};
