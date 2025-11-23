import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface AddHabitFormProps {
  onAddHabit: (name: string) => void;
}

export const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAddHabit }) => {
  const [habitName, setHabitName] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(() => {
    gsap.from(formRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.4 // Delay slightly to play after header
    });
  }, { scope: formRef });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit(habitName.trim());
      setHabitName('');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Add a new habit..."
          className="block w-full pl-11 pr-28 md:pr-32 py-3 md:py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent text-sm md:text-base shadow-lg transition-all font-sans"
          maxLength={50}
        />
        <div className="absolute inset-y-0 right-0 flex py-2 pr-2">
          <button
            type="submit"
            disabled={!habitName.trim()}
            className="px-3 md:px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm font-medium rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer font-heading tracking-wide"
          >
            Add Habit
          </button>
        </div>
      </div>
    </form>
  );
};
