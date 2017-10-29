/**
 * Gets all events from calendar.
 */
export const getAllEvents = () =>
  Array.from(document.querySelectorAll('div[role="row"]'))
    .filter(row => row.children[1] && row.children[1].children.length === 3)
    .map(event => {
      const eventElement = event.children[1].children[1]
        .children[0] as HTMLElement;
      const calendarElement = event.children[1].children[2]
        .children[0] as HTMLElement;

      const eventid = atob(eventElement.dataset.eventid);
      const data = eventid.split(' ');

      return {
        id: data[0],
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
