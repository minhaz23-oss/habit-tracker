import React, { useState, useEffect, useRef } from 'react';
import type { Habit, HabitCompletion } from '../types';
import { formatDate, getDaysInMonth, getHabitStatus } from '../utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface HabitGridProps {
  habits: Habit[];
  completions: HabitCompletion[];
  year: number;
  month: number;
  onUpdateStatus: (habitId: string, date: string, newStatus: 'none' | 'completed' | 'failed') => void;
  onDeleteHabit: (habitId: string) => void;
}

interface HabitCellProps {
  habitId: string;
  dateStr: string;
  day: number;
  status: 'none' | 'completed' | 'failed';
  isToday: boolean;
  isActive: boolean;
  onCellClick: (habitId: string, date: string, currentStatus: 'none' | 'completed' | 'failed') => void;
  onPopupAction: (habitId: string, date: string, status: 'completed' | 'failed') => void;
  setPopupRef: (el: HTMLDivElement | null) => void;
}

const HabitCell: React.FC<HabitCellProps> = ({
  habitId,
  dateStr,
  day,
  status,
  isToday,
  isActive,
  onCellClick,
  onPopupAction,
  setPopupRef
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (status === 'completed') {
      // Congratulation/Burst effect
      gsap.fromTo(buttonRef.current,
        { scale: 0.8, rotation: -10 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
          keyframes: [
            { scale: 1.4, rotation: 10, duration: 0.1 },
            { scale: 1, rotation: 0, duration: 0.5 }
          ]
        }
      );
    } else if (status === 'failed') {
      // Shake effect
      gsap.fromTo(buttonRef.current,
        { x: 0 },
        {
          x: 0,
          duration: 0.5,
          ease: 'power1.inOut',
          keyframes: [
            { x: -4, duration: 0.05 },
            { x: 4, duration: 0.05 },
            { x: -4, duration: 0.05 },
            { x: 4, duration: 0.05 },
            { x: 0, duration: 0.05 }
          ]
        }
      );
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center gap-1 relative">
      <span className={`text-xs font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
        {day}
      </span>

      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          onCellClick(habitId, dateStr, status);
        }}
        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors duration-200 ${status === 'completed'
          ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm scale-100'
          : status === 'failed'
            ? 'bg-rose-500 border-rose-500 text-white shadow-sm scale-100'
            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 text-transparent hover:scale-105'
          } ${isToday ? 'ring-2 ring-blue-100 dark:ring-blue-900 ring-offset-2 dark:ring-offset-gray-800' : ''}`}
        title={status === 'none' ? 'Click to set status' : 'Click to clear'}
      >
        {status === 'completed' && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === 'failed' && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Popup Menu */}
      {isActive && (
        <div
          ref={setPopupRef}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPopupAction(habitId, dateStr, 'completed');
            }}
            className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors"
            title="Mark as Completed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPopupAction(habitId, dateStr, 'failed');
            }}
            className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50 transition-colors"
            title="Mark as Failed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white dark:border-t-gray-800" />
        </div>
      )}
    </div>
  );
};

export const HabitGrid: React.FC<HabitGridProps> = ({
  habits,
  completions,
  year,
  month,
  onUpdateStatus,
  onDeleteHabit
}) => {
  const [activePopup, setActivePopup] = useState<{ habitId: string; date: string } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDay = isCurrentMonth ? today.getDate() : null;

  useGSAP(() => {
    // Staggered entry for habit cards
    gsap.from('.habit-card', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'all' // Clear props to allow hover effects to work properly
    });
  }, { scope: containerRef, dependencies: [habits.length] });

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setActivePopup(null);
      }
    };

    if (activePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopup]);

  const handleCellClick = (habitId: string, date: string, currentStatus: 'none' | 'completed' | 'failed') => {
    if (currentStatus !== 'none') {
      onUpdateStatus(habitId, date, 'none');
      setActivePopup(null);
    } else {
      setActivePopup({ habitId, date });
    }
  };

  const handlePopupAction = (habitId: string, date: string, status: 'completed' | 'failed') => {
    onUpdateStatus(habitId, date, status);
    setActivePopup(null);
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 animate-entry">
        <p className="text-lg">No habits yet. Add your first habit to get started!</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-8">
      {habits.map((habit) => (
        <div key={habit.id} className="habit-card group relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/30 p-4 md:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] hover:bg-white/50 dark:hover:bg-gray-800/50">
          {/* Habit header with name and delete button */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="font-heading font-semibold text-gray-900 dark:text-white text-lg md:text-xl tracking-tight">{habit.name}</h3>
            <button
              onClick={() => onDeleteHabit(habit.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
              title="Delete habit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Days grid - wrapping */}
          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-2 md:gap-3">
            {days.map(day => {
              const dateStr = formatDate(year, month, day);
              const status = getHabitStatus(habit.id, dateStr, completions);
              const isToday = day === currentDay;
              const isActive = activePopup?.habitId === habit.id && activePopup?.date === dateStr;

              return (
                <HabitCell
                  key={day}
                  habitId={habit.id}
                  dateStr={dateStr}
                  day={day}
                  status={status}
                  isToday={isToday}
                  isActive={isActive}
                  onCellClick={handleCellClick}
                  onPopupAction={handlePopupAction}
                  setPopupRef={(el) => { popupRef.current = el; }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
