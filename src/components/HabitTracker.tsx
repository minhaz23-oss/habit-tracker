import React, { useState, useEffect, useRef } from 'react';
import type { Habit, HabitCompletion, HabitData } from '../types';
import { loadHabitData, saveHabitData } from '../storage';
import { calculateMonthStats, getMonthName } from '../utils';
import { HabitGrid } from './HabitGrid';
import { AddHabitForm } from './AddHabitForm';
import { Statistics } from './Statistics';
import { ProgressChart } from './ProgressChart';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

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
  const [showStats, setShowStats] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const darkModeBtnRef = useRef<HTMLButtonElement>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useGSAP(() => {
    // Header animation
    gsap.from(headerRef.current, {
      y: -30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Staggered entry for main content
    gsap.from('.animate-entry', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.2
    });
  }, { scope: containerRef });

  // Dark mode toggle animation
  useGSAP(() => {
    if (darkModeBtnRef.current) {
      gsap.fromTo(darkModeBtnRef.current,
        { rotation: -180, scale: 0.5 },
        { rotation: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [darkMode]);

  // Parallax Effect
  useGSAP(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      gsap.utils.toArray<HTMLElement>('.parallax-bg img').forEach((img) => {
        const speed = parseFloat(img.dataset.speed || '0.02');
        const x = (clientX - centerX) * speed;
        const y = (clientY - centerY) * speed;

        gsap.to(img, {
          x,
          y,
          duration: 1,
          ease: 'power2.out'
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: containerRef });

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

  // Handle scroll for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  const confirmDelete = (habitId: string) => {
    setHabitToDelete(habitId);
  };

  const executeDelete = () => {
    if (habitToDelete) {
      setHabitData((prev) => ({
        habits: prev.habits.filter((h) => h.id !== habitToDelete),
        completions: prev.completions.filter((c) => c.habitId !== habitToDelete)
      }));
      setHabitToDelete(null);
    }
  };

  const cancelDelete = () => {
    setHabitToDelete(null);
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
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white overflow-hidden pt-[50px]">
      {/* Fixed Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900" />



        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 dark:bg-purple-600/10 blur-[100px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-orange-300/20 dark:bg-orange-600/5 blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10 px-4 md:px-6">
        {/* Header */}
        <div ref={headerRef} className="relative text-center space-y-4 py-6 px-4 md:py-8 md:px-6 rounded-3xl bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 shadow-xl">
          <div className="absolute right-4 top-4 md:right-6 md:top-8 z-10">
            <button
              ref={darkModeBtnRef}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
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
          <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent pb-2 drop-shadow-sm">
            Habit Tracker
          </h1>
          <p className="text-base md:text-lg font-sans text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
            Build consistency and track your progress with a simple, focused interface.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-center animate-entry">
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
        {habitData.habits.length > 0 && (
          <div className="animate-entry">
            {/* Mobile: Collapsible with toggle button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowStats(!showStats)}
                className="w-full mb-4 px-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg text-gray-900 dark:text-white font-medium flex items-center justify-between transition-all hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <span className="font-heading">Statistics</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showStats ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showStats && <Statistics stats={stats} />}
            </div>
            {/* Desktop: Always visible */}
            <div className="hidden md:block">
              <Statistics stats={stats} />
            </div>
          </div>
        )}

        {/* Add Habit Form */}
        <div className="animate-entry">
          <AddHabitForm onAddHabit={handleAddHabit} />
        </div>

        {/* Search Bar - Only show if there are habits */}
        {habitData.habits.length > 0 && (
          <div className="animate-entry">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search habits..."
                className="block w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent text-sm shadow-lg transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Habit Grid */}
        <div className="mb-6 animate-entry">
          <HabitGrid
            habits={habitData.habits.filter(habit =>
              habit.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            completions={habitData.completions}
            year={year}
            month={month}
            onUpdateStatus={handleUpdateStatus}
            onDeleteHabit={confirmDelete}
          />
        </div>

        {/* Delete Confirmation Modal */}
        {habitToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-200 dark:border-gray-700 scale-100 animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Habit?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete this habit? This action cannot be undone and all completion data will be lost.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

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

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-xl hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};
