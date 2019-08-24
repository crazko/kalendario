import { Calendars } from './calendar';

export type Request =
  | ReturnType<typeof fetchEventMessage>
  | ReturnType<typeof fetchCalendarListMessage>;

export enum message {
  FETCH_EVENT = 'FETCH_EVENT',
  FETCH_CALENDAR_LIST = 'FETCH_CALENDAR_LIST',
}

const fetchEventMessage = (calendarId: string, eventId: string) => ({
  message: message.FETCH_EVENT as message.FETCH_EVENT,
  calendarId,
  eventId,
});

export const sendFetchEventMessage = (
  calendarId: string,
  eventId: string,
  proccessEvent: (event: gapi.client.calendar.Event) => void,
) =>
  chrome.runtime.sendMessage(fetchEventMessage(calendarId, eventId), event => {
    proccessEvent(event);
  });

const fetchCalendarListMessage = () => ({
  message: message.FETCH_CALENDAR_LIST as message.FETCH_CALENDAR_LIST,
});

export const sendFetchCalendarListMessage = (
  proccessCalendarList: (calendarList: Calendars) => void,
) =>
  chrome.runtime.sendMessage(fetchCalendarListMessage(), calendarList => {
    proccessCalendarList(calendarList);
  });
