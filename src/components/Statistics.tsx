import React from 'react';
import type { MonthStats } from '../types';

interface StatisticsProps {
  stats: MonthStats;
}

export const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.currentStreak}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">days</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Longest Streak</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.longestStreak}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">days</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Completed</p>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalCompletions}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">this month</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Daily</p>
        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.averageDaily.toFixed(0)}%</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">completion</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Best Day</p>
        <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
          {stats.bestDay !== null ? stats.bestDay : '-'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">of month</p>
      </div>
    </div>
  );
};
