import { Calendars } from '../app/calendar';

export type Action =
  | ReturnType<typeof addEventAction>
  | ReturnType<typeof fetchEventAction>
  | ReturnType<typeof addCalendarListAction>;

export enum type {
  ADD_EVENT = 'ADD_EVENT',
  FETCH_EVENT = 'FETCH_EVENT',
  ADD_CALENDAR_LIST = 'ADD_CALENDAR_LIST',
}

export const addEventAction = (id: string, description?: string) => ({
  type: type.ADD_EVENT as const,
  id,
  description,
});

export const fetchEventAction = (id: string) => ({
  type: type.FETCH_EVENT as const,
  id,
});

export const addCalendarListAction = (calendarList: Calendars) => ({
  type: type.ADD_CALENDAR_LIST as const,
  calendarList,
});
