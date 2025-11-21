# Habit Tracker

A clean, minimal habit tracker web application built with React, TypeScript, and Tailwind CSS. Track your daily habits with a simple checkbox grid interface similar to a paper habit tracker.

## Features

✅ **Clean Spreadsheet-Style Design**
- Minimal paper-like grid layout
- Habits listed in rows with days (1-31) in columns
- Clear grid lines and professional styling
- Today's date is highlighted

✅ **Habit Management**
- Add custom habits with a simple form
- Delete habits with confirmation
- Habits persist across sessions

✅ **Daily Tracking**
- Three-state system for each day: Empty → Completed (✓) → Failed (✗) → Empty
- Click to cycle through states:
  - **Empty**: Not tracked yet (white box)
  - **Completed**: Successfully completed habit (green with checkmark)
  - **Failed**: Failed to complete habit (red with X)
- Data saves automatically to localStorage
- View and edit any day of the month

✅ **Statistics Dashboard**
- Current streak (consecutive days with 100% completion)
- Longest streak this month
- Total completions count
- Average daily completion percentage
- Best day of the month

✅ **Monthly Progress Chart**
- Visual bar chart showing daily completion percentages
- Color-coded bars (green for 100%, blue for 75-99%, etc.)
- Hover tooltips with detailed stats
- Track your progress over time

✅ **Month Navigation**
- Navigate between months with Previous/Next buttons
- Jump back to current month easily
- View historical data

✅ **Responsive Design**
- Works on desktop and mobile devices
- Horizontal scroll for habit grid on smaller screens
- Printable layout

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **localStorage** - Data persistence (no backend needed)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Add Habits**: Enter a habit name in the input field and click "Add Habit"
2. **Track Daily**: Click each day box to cycle through states:
   - First click: Mark as completed (green checkmark)
   - Second click: Mark as failed (red X)
   - Third click: Clear/reset to empty
3. **View Progress**: See your statistics and progress chart (only completed habits count)
4. **Navigate Months**: Use Previous/Next buttons to view different months
5. **Delete Habits**: Click the × button next to a habit to remove it

## Data Storage

All data is stored locally in your browser's localStorage:
- No account required
- No data sent to any server
- Data persists across sessions
- Clear browser data to reset

## Project Structure

```
src/
├── components/
│   ├── HabitTracker.tsx    # Main component with state management
│   ├── HabitGrid.tsx        # Checkbox grid for habits and days
│   ├── AddHabitForm.tsx     # Form to add new habits
│   ├── Statistics.tsx       # Stats cards display
│   └── ProgressChart.tsx    # Monthly progress visualization
├── types.ts                 # TypeScript interfaces
├── storage.ts               # localStorage utilities
├── utils.ts                 # Helper functions for calculations
├── App.tsx                  # App entry point
└── index.css                # Tailwind imports
```

## License

This project is open source and available for personal use.
