import type { HabitData } from './types';

const STORAGE_KEY = 'habit-tracker-data';

export const loadHabitData = (): HabitData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading habit data:', error);
  }
  return { habits: [], completions: [] };
};

export const saveHabitData = (data: HabitData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving habit data:', error);
  }
};
