export interface IEvent {
  id: string;
  calendarName: string;
}

/**
 * Gets all events from calendar.
 */
export const getAllEvents = (): IEvent[] =>
  Array.from(document.querySelectorAll('div[role="main"] div[role="row"]'))
    .filter(row => {
      return (
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
      );
    })
    .map(row => {
      let eventElement;
      let calendarElement;

      if (row.children.length === 1) {
        eventElement = row.children[0].children[1].children[0] as HTMLElement;
        calendarElement = row.children[0].children[2]
          .children[0] as HTMLElement;
      }

      if (row.children.length === 2) {
        eventElement = row.children[1].children[1].children[0] as HTMLElement;
        calendarElement = row.children[1].children[2]
          .children[0] as HTMLElement;
      }

      const dataAttrEventId = atob(eventElement.dataset.eventid);
      const data = dataAttrEventId.split(' ');
      const eventId = data[0];

      row.id = eventId;
      row.className += ' calex__event';

      return {
        id: eventId,
        calendarName: calendarElement.dataset.text,
      };
    });

export const addDescriptionToEvent = (eventId: string, description: string) => {
  const descriptionElement = document.createElement('div');
  descriptionElement.insertAdjacentHTML('afterbegin', description);
  descriptionElement.className = 'calex__description';

  const event = document.getElementById(eventId);
  event.appendChild(descriptionElement);
};
