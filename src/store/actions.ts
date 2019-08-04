export type Action =
  | ReturnType<typeof addEventAction>
  | ReturnType<typeof fetchEventAction>;

export enum type {
  ADD_EVENT = 'ADD_EVENT',
  FETCH_EVENT = 'FETCH_EVENT',
  REMOVE_FETCH_EVENT = 'REMOVE_FETCH_EVENT',
}

export const addEventAction = (
  id: string,
  calendarName?: string,
  description?: string,
) => ({
  type: type.ADD_EVENT as type.ADD_EVENT,
  event: {
    id,
    calendarName,
    description,
  },
});

export const fetchEventAction = (eventId: string, calendarName: string) => ({
  type: type.FETCH_EVENT as type.FETCH_EVENT,
  eventId,
  calendarName,
});
