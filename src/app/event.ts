import { CSSClass } from './types';

export type Events = Record<string, IEvent | undefined>;

interface IEvent {
  id: string;
  description?: string;
}

const getEventId = (eventId: string) => {
  // Reminders have different event id which cause an error
  try {
    const dataAttrEventId = atob(eventId);
    const [id, account] = dataAttrEventId.split(' ');
    return id;
  } catch (e) {
    return undefined;
  }
};

export const addEventDataAttributes = (row: HTMLElement): void => {
  const eventElement = row.children[1] as HTMLElement;
  const dataEventId = eventElement.dataset.eventid;
  const eventId = dataEventId && getEventId(dataEventId);

  const calendarElement = eventElement.children[2].children[0] as HTMLElement;
  const calendarName = calendarElement.dataset.text;

  if (eventId) {
    row.dataset.eventId = eventId;
  }

  if (calendarName) {
    row.dataset.calendarName = calendarName;
  }
};

export const getEventDataAttributes = (row: HTMLElement) => {
  if (
    'eventId' in row.dataset === false ||
    'calendarName' in row.dataset === false
  ) {
    addEventDataAttributes(row);
  }

  const { eventId, calendarName } = row.dataset;

  return {
    eventId,
    calendarName,
  };
};

export const addEventDescription = (
  row: HTMLElement,
  description: string,
): void => {
  // Break if already has description
  if (row.getElementsByClassName(CSSClass.eventDescription).length > 0) {
    return;
  }

  const contentElement = document.createElement('div');
  contentElement.className = CSSClass.eventContent;
  // Should be secure as Google Calendar escapes letters automatically
  contentElement.insertAdjacentHTML('afterbegin', description);

  const descriptionElement = document.createElement('div');
  descriptionElement.className = CSSClass.eventDescription;
  descriptionElement.appendChild(contentElement);

  row.classList.add(CSSClass.event);
  row.appendChild(descriptionElement);
};
