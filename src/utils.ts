import type { Habit, HabitCompletion, DayStats, MonthStats } from './types';

export const formatDate = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const isHabitCompleted = (
  habitId: string,
  date: string,
  completions: HabitCompletion[]
): boolean => {
  return completions.some(c => c.habitId === habitId && c.date === date);
};

export const calculateDayStats = (
  day: number,
  year: number,
  month: number,
  habits: Habit[],
  completions: HabitCompletion[]
): DayStats => {
  const dateStr = formatDate(year, month, day);
  const completedCount = habits.filter(h => 
    isHabitCompleted(h.id, dateStr, completions)
  ).length;
  const totalHabits = habits.length;
  const percentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

  return {
    date: day,
    completedCount,
    totalHabits,
    percentage
  };
};

export const calculateMonthStats = (
  year: number,
  month: number,
  habits: Habit[],
  completions: HabitCompletion[]
): MonthStats => {
  const daysInMonth = getDaysInMonth(year, month);
  const dailyStats: DayStats[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    dailyStats.push(calculateDayStats(day, year, month, habits, completions));
  }

  // Calculate total completions
  const totalCompletions = dailyStats.reduce((sum, day) => sum + day.completedCount, 0);

  // Calculate average daily completion
  const averageDaily = habits.length > 0 
    ? totalCompletions / (daysInMonth * habits.length) * 100 
    : 0;

  // Find best day
  const bestDay = dailyStats.length > 0
    ? dailyStats.reduce((best, current) => 
        current.percentage > best.percentage ? current : best
      ).date
    : null;

  // Calculate streaks (days with 100% completion)
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDay = isCurrentMonth ? today.getDate() : daysInMonth;

  for (let i = currentDay - 1; i >= 0; i--) {
    if (dailyStats[i].percentage === 100 && dailyStats[i].totalHabits > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  for (let i = 0; i < daysInMonth; i++) {
    if (dailyStats[i].percentage === 100 && dailyStats[i].totalHabits > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    averageDaily,
    bestDay
  };
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};
