export interface Habit {
  id: string;
  name: string;
  createdAt: string;
}

export type CompletionStatus = 'completed' | 'failed';

export interface HabitCompletion {
  habitId: string;
  date: string; // Format: YYYY-MM-DD
  status: CompletionStatus;
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
