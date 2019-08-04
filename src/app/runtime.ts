import { IEvent } from './event';

export type Request =
  | ReturnType<typeof addEventMessage>
  | ReturnType<typeof fetchEventMessage>;

export enum message {
  ADD_EVENT = 'ADD_EVENT',
  FETCH_EVENT = 'FETCH_EVENT',
}

export const addEventMessage = (event: gapi.client.calendar.Event) => ({
  message: message.ADD_EVENT as message.ADD_EVENT,
  event,
});

export const sendAddEventMessage = (event: gapi.client.calendar.Event) =>
  chrome.tabs.query(
    {
      url: 'https://calendar.google.com/calendar*',
    },
    tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id!, addEventMessage(event));
      });
    },
  );

export const fetchEventMessage = (event: IEvent) => ({
  message: message.FETCH_EVENT as message.FETCH_EVENT,
  event,
});

export const sendFetchEventMessage = (
  event: IEvent,
  proccessEvent: (event: gapi.client.calendar.Event | IEvent) => void,
) =>
  chrome.runtime.sendMessage(fetchEventMessage(event), event => {
    proccessEvent(event);
  });
