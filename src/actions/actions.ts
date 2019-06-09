import { cssClass, IEvent } from '../utils/definitions';

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
  const rowNodes = document.getElementsByClassName(cssClass.eventRow);

  const rows = Array.from(rowNodes).filter(
    (row: Element) =>
      !row.classList.contains(cssClass.eventMultiDay) &&
      row.getElementsByClassName(cssClass.eventDescription).length === 0,
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
      console.log({ eventId: eventElement.dataset.eventid });
    } catch (e) {
      return events;
    }

    // Event is multi-day event, does not need to handle it again.
    if (eventIds.includes(eventId)) {
      row.classList.add(cssClass.eventMultiDay);
      return events;
    }

    eventIds.push(eventId);

    const calendarElement = row.children[1].children[2]
      .children[0] as HTMLElement;
    const calendarName = getEventCalendarName(calendarElement);

    // Mark rows so they are easily accessible when adding description
    row.id = eventId;
    row.classList.add(cssClass.event);

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
  const event = document.getElementById(eventId);

  // Remove all previously added nodes
  const addedDescriptions = event.getElementsByClassName(
    cssClass.eventDescription,
  );

  Array.from(addedDescriptions).forEach((element: Element) => {
    event.removeChild(element);
  });

  const contentElement = document.createElement('div');
  contentElement.className = cssClass.eventContent;
  contentElement.insertAdjacentHTML('afterbegin', description);

  const descriptionElement = document.createElement('div');
  descriptionElement.className = cssClass.eventDescription;
  descriptionElement.appendChild(contentElement);

  event.appendChild(descriptionElement);
};
