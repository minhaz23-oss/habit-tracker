export interface Habit {
  id: string;
  name: string;
  createdAt: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // Format: YYYY-MM-DD
}

export interface HabitData {
  habits: Habit[];
  completions: HabitCompletion[];
}

export interface DayStats {
  date: number;
  completedCount: number;
  totalHabits: number;
  percentage: number;
}

export interface MonthStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  averageDaily: number;
  bestDay: number | null;
}
