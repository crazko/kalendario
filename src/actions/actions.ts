import { logger } from '../utils/logger';

interface IEvent {
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

const EVENT_ROW_CLASS = 'taTyDe';

export enum messages {
  FETCH_EVENTS = 'FETCH_EVENTS',
  SHOW_EVENT = 'SHOW_EVENT',
}

export const sendEventToContent = (
  event: gapi.client.calendar.Event,
  message: string,
) => {
  // Do not send event without description
  if (!event.hasOwnProperty('description')) {
    return Promise.reject(
      `Event "${event.summary}" doesn't have a description.`,
    );
  }

  chrome.tabs.query(
    {
      url: 'https://calendar.google.com/calendar*',
    },
    tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          msg: message,
          data: {
            event,
          },
        });
      });
    },
  );

  return Promise.resolve(`Sending event "${event.summary}".`);
};

const getEventId = (hiddenEventId: string) => {
  // Reminders have different eventid which cause an error with atop()
  const dataAttrEventId = atob(hiddenEventId);
  const [eventId, account] = dataAttrEventId.split(' ');

  return eventId;
};

const getEventCalendarName = (element: HTMLElement) => element.dataset.text;

/**
 * Gets all events from calendar.
 */
export const getAllEvents = (): IEvent[] => {
  const eventIds: string[] = [];
  const rowNodes = document.getElementsByClassName(EVENT_ROW_CLASS);

  // const rows = Array.from(rowNodes).reduce(rowNodesReducer, []);
  const rows = Array.from(rowNodes).filter(
    (row: Element) =>
      !row.classList.contains('calex__event--multiday') &&
      row.getElementsByClassName('calex__description').length === 0,
    // !(
    //   row.children &&
    //   row.children[1] &&
    //   row.children[1].children[1].getElementsByTagName('span')
    // ),
  );

  const rowsReducer = (events: IEvent[], row: Element) => {
    let eventId;
    const eventElement = row.children[1] as HTMLElement;

    try {
      eventId = getEventId(eventElement.dataset.eventid);
      logger({ eventId: eventElement.dataset.eventid });
    } catch (e) {
      return events;
    }

    // Event is multi-day event, does not need to handle it again.
    if (eventIds.includes(eventId)) {
      row.classList.add('calex__event--multiday');
      return events;
    }

    eventIds.push(eventId);

    const calendarElement = row.children[1].children[2]
      .children[0] as HTMLElement;
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

  const contentElement = document.createElement('div');
  const descriptionElement = document.createElement('div');
  const event = document.getElementById(eventId);

  // Remove all previously added nodes
  const addedDescriptions = event.getElementsByClassName(classNameDescription);

  Array.from(addedDescriptions).forEach((element: Element) => {
    event.removeChild(element);
  });

  contentElement.className = 'calex__description--content';
  contentElement.insertAdjacentHTML('afterbegin', description);

  descriptionElement.className = classNameDescription;
  descriptionElement.appendChild(contentElement);

  event.appendChild(descriptionElement);
};
