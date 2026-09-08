import { Workout } from "@/types/entities";

export type DashboardPeriod = "week" | "month";

export interface PeriodRange {
  start: Date;
  end: Date;
}

const startOfDay = (date: Date): Date => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date: Date): Date => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

/** Calendar week starting Monday (local time). */
export const startOfWeek = (date: Date = new Date()): Date => {
  const start = startOfDay(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
};

/** First day of the calendar month (local time). */
export const startOfMonth = (date: Date = new Date()): Date => {
  const start = startOfDay(date);
  start.setDate(1);
  return start;
};

/** Inclusive range from period start through end of today. */
export const getPeriodRange = (
  period: DashboardPeriod,
  now: Date = new Date(),
): PeriodRange => ({
  start: period === "week" ? startOfWeek(now) : startOfMonth(now),
  end: endOfDay(now),
});

export const isDateInRange = (
  value: string | Date,
  range: PeriodRange,
): boolean => {
  const date = new Date(value);
  return date >= range.start && date <= range.end;
};

export const filterWorkoutsByPeriod = (
  workouts: Workout[],
  period: DashboardPeriod,
  now: Date = new Date(),
): Workout[] => {
  const range = getPeriodRange(period, now);
  return workouts.filter((workout) => isDateInRange(workout.date, range));
};

export const getPeriodLabel = (period: DashboardPeriod): string =>
  period === "week" ? "this week" : "this month";
