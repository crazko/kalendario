export interface IEvent {
  id: string;
  calendarName: string;
}

interface IEvents {
  events: IEvent[];
}

interface IGapiEvent {
  event: gapi.client.calendar.Event;
}

interface IMessage<T> {
  msg: string;
  data: T;
}

export type GapiEventMessage = IMessage<IGapiEvent>;
export type EventsMessage = IMessage<IEvents>;

export enum cssClass {
  eventRow = 'taTyDe',
  event = 'calex__event',
  eventMultiDay = 'calex__event--multiday',
  eventDescription = 'calex__description',
  eventContent = 'calex__description--content',
}

export enum messages {
  FETCH_EVENTS = 'FETCH_EVENTS',
  SHOW_EVENT = 'SHOW_EVENT',
}
