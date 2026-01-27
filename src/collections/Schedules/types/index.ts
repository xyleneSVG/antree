export interface WeeklyScheduleRow {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface SchedulesData {
  resource: string;
  weeklySchedule: WeeklyScheduleRow[];
}