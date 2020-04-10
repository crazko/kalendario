import { Calendars } from './calendar';
import { IEvent } from './event';

export type Request =
  | ReturnType<typeof fetchEventMessage>
  | ReturnType<typeof fetchCalendarListMessage>;

export enum message {
  FETCH_EVENT = 'FETCH_EVENT',
  FETCH_CALENDAR_LIST = 'FETCH_CALENDAR_LIST',
}

const fetchEventMessage = (calendarId: string, eventId: string) => ({
  message: message.FETCH_EVENT as const,
  calendarId,
  eventId,
});

export const sendFetchEventMessage = (
  calendarId: string,
  eventId: string,
  responseCallback: (event: IEvent) => void,
) =>
  chrome.runtime.sendMessage(fetchEventMessage(calendarId, eventId), event =>
    responseCallback(event),
  );

const fetchCalendarListMessage = () => ({
  message: message.FETCH_CALENDAR_LIST as const,
});

export const sendFetchCalendarListMessage = (
  responseCallback: (calendarList: Calendars) => void,
) =>
  chrome.runtime.sendMessage(fetchCalendarListMessage(), calendarList =>
    responseCallback(calendarList),
  );
