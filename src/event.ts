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
    .map(event => {
      console.log(event);
      let eventElement;
      let calendarElement;

      if (event.children.length === 1) {
        eventElement = event.children[0].children[1].children[0] as HTMLElement;
        calendarElement = event.children[0].children[2]
          .children[0] as HTMLElement;
      }

      if (event.children.length === 2) {
        eventElement = event.children[1].children[1].children[0] as HTMLElement;
        calendarElement = event.children[1].children[2]
          .children[0] as HTMLElement;
      }

      const dataAttrEventId = atob(eventElement.dataset.eventid);
      const data = dataAttrEventId.split(' ');
      const eventId = data[0];

      eventElement.id = eventId;

      return {
        id: eventId,
        calendarName: calendarElement.dataset.text,
      };
    });

export const addDescriptionToEvent = (eventId: string, description: string) => {
  // let $event = $('#' + eventId);
  // Avoid duplicated content
  //   if ($event.find('.calex__description')) {
  // $event.find('.calex__description').remove();
  //   }
  //   $event.append(`<div class="calex__description">${description}</div>`);
};
