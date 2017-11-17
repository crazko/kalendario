import { IMessage } from './utils';

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

export type IGapiEventMessage = IMessage<IGapiEvent>;
export type IEventsMessage = IMessage<IEvents>;

/**
 * Gets all events from calendar.
 */
export const getAllEvents = (): IEvent[] => {
  const container = document.getElementById('YPCqFe'); // main parent
  const rowNodes = document.getElementsByClassName('taTyDe'); // row
  const rows = [];
  const events: IEvent[] = [];

  // Fitler out correct rows
  for (let i = 0; i < rowNodes.length; i++) {
    const row = rowNodes[i];

    if (
      !row.getAttribute('id') &&
      row.children &&
      ((row.children.length === 1 &&
        row.children[0].children &&
        row.children[0].children.length === 3 &&
        row.children[0].children[1].children &&
        row.children[0].children[1].children.length === 2) ||
        (row.children.length === 2 &&
          row.children[1].children &&
          row.children[1].children.length === 3 &&
          row.children[1].children[1].children &&
          row.children[1].children[1].children.length === 2))
    ) {
      rows.push(row);
    }
  }

  // Create Event objects
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    let eventElement;
    let calendarElement;

    if (row.children.length === 1) {
      eventElement = row.children[0].children[1].children[0] as HTMLElement;
      calendarElement = row.children[0].children[2].children[0] as HTMLElement;
    }

    if (row.children.length === 2) {
      eventElement = row.children[1].children[1].children[0] as HTMLElement;
      calendarElement = row.children[1].children[2].children[0] as HTMLElement;
    }

    const dataAttrEventId = atob(eventElement.dataset.eventid);
    const data = dataAttrEventId.split(' ');
    const eventId = data[0];

    row.id = eventId;
    row.className += ' calex__event';

    events.push({
      id: eventId,
      calendarName: calendarElement.dataset.text,
    });
  }

  return events;
};

export const addDescriptionToEvent = (eventId: string, description: string) => {
  const classNameDescription = 'calex__description';
  const classNameHasDescription = 'calex__event--has-description';

  const contentElement = document.createElement('div');
  const descriptionElement = document.createElement('div');
  const event = document.getElementById(eventId);

  // Remove all previously added nodes
  const addedDescriptions = event.getElementsByClassName(classNameDescription);
  Array.from(addedDescriptions).forEach(element => {
    event.removeChild(element);
  });

  contentElement.className = 'calex__description--content';
  contentElement.insertAdjacentHTML('afterbegin', description);

  descriptionElement.className = classNameDescription;
  descriptionElement.appendChild(contentElement);

  event.appendChild(descriptionElement);
  event.className += ' ' + classNameHasDescription;
};
