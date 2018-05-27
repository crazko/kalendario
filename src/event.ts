import { IMessage } from './utils';

const EVENT_ROW_CLASS = 'taTyDe';

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

export type GapiEventMessage = IMessage<IGapiEvent>;
export type EventsMessage = IMessage<IEvents>;

const getEventId = (element: HTMLElement) => {
  // Reminders have different eventid which cause an error with atop()
  const dataAttrEventId = atob(element.dataset.eventid);
  const [eventId, account] = dataAttrEventId.split(' ');

  return eventId;
};

const getEventCalendarName = (element: HTMLElement) => element.dataset.text;

/**
 * Gets all events from calendar.
 */
export const getAllEvents = (): IEvent[] => {
  const rowNodes = document.getElementsByClassName(EVENT_ROW_CLASS);

  // Get only correct rows
  const rowNodesReducer = (rows: Element[], row: Element) => {
    if (
      !row.classList.contains('calex__event') &&
      row.children &&
      (row.children.length === 2 &&
        row.children[1].children &&
        row.children[1].children.length === 3)
    ) {
      rows.push(row);
    }

    return rows;
  };

  const rows = Array.from(rowNodes).reduce(rowNodesReducer, []);

  const rowsReducer = (events: IEvent[], row: Element) => {
    const eventElement = row.children[1] as HTMLElement;
    const calendarElement = row.children[1].children[2]
      .children[0] as HTMLElement;

    let eventId;

    try {
      eventId = getEventId(eventElement);
    } catch (e) {
      return events;
    }

    const calendarName = getEventCalendarName(calendarElement);

    // Mark rows so they are easily accessible when adding description
    row.id = eventId;
    row.classList.add('calex__event');

    events.push({
      id: eventId,
      calendarName,
    });

    return events;
  };

  // Create Events
  return rows.reduce(rowsReducer, []);
};

export const addDescriptionToEvent = (eventId: string, description: string) => {
  const classNameDescription = 'calex__description';
  const classNameHasDescription = 'calex__event--has-description';

  const contentElement = document.createElement('div');
  const descriptionElement = document.createElement('div');
  const event = document.getElementById(eventId);

  // Remove all previously added nodes
  const addedDescriptions = event.getElementsByClassName(classNameDescription);

  [...addedDescriptions].forEach((element: Element) => {
    event.removeChild(element);
  });

  contentElement.className = 'calex__description--content';
  contentElement.insertAdjacentHTML('afterbegin', description);

  descriptionElement.className = classNameDescription;
  descriptionElement.appendChild(contentElement);

  event.appendChild(descriptionElement);
  event.className += ' ' + classNameHasDescription;
};
