import React from 'react';
import type { Habit, HabitCompletion } from '../types';
import { calculateDayStats, getDaysInMonth } from '../utils';

interface ProgressChartProps {
  habits: Habit[];
  completions: HabitCompletion[];
  year: number;
  month: number;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  habits,
  completions,
  year,
  month
}) => {
  const daysInMonth = getDaysInMonth(year, month);
  const dailyStats = Array.from({ length: daysInMonth }, (_, i) =>
    calculateDayStats(i + 1, year, month, habits, completions)
  );

  const maxPercentage = 100;
  const chartHeight = 200;

  if (habits.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Progress</h3>
      <div className="relative" style={{ height: chartHeight }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* Chart area */}
        <div className="absolute left-14 right-0 top-0 bottom-0">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 25, 50, 75, 100].map((value) => (
              <div key={value} className="border-t border-gray-200 dark:border-gray-700" />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-start gap-px">
            {dailyStats.map((stat) => {
              const barHeight = (stat.percentage / maxPercentage) * chartHeight;
              const color =
                stat.percentage === 100
                  ? 'bg-green-500'
                  : stat.percentage >= 75
                    ? 'bg-blue-500'
                    : stat.percentage >= 50
                      ? 'bg-yellow-500'
                      : stat.percentage > 0
                        ? 'bg-orange-500'
                        : 'bg-gray-300 dark:bg-gray-600';

              return (
                <div
                  key={stat.date}
                  className="relative flex-1 group"
                  style={{ height: chartHeight }}
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${color} transition-all hover:opacity-80`}
                    style={{ height: `${barHeight}px` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Day {stat.date}: {stat.percentage.toFixed(0)}%
                    <br />
                    ({stat.completedCount}/{stat.totalHabits})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span>100%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <span>75-99%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded" />
          <span>50-74%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded" />
          <span>1-49%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
          <span>0%</span>
        </div>
      </div>
    </div>
  );
};
