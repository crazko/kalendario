import { logDebug } from './utils';

const addDescription = (eventId: string, description: string) => {
  // let $event = $('#' + eventId);
  // Avoid duplicated content
  //   if ($event.find('.calex__description')) {
  // $event.find('.calex__description').remove();
  //   }
  //   $event.append(`<div class="calex__description">${description}</div>`);
};

/**
 * Gets all events from calendar.
 */
const getAllEvents = () =>
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

// Check for change in calendar.
// Gather all events and send them to background to process
const observer = new MutationObserver(mutations => {
  if (document.querySelector('div[role="grid"]') !== null) {
    chrome.runtime.sendMessage(
      {
        msg: 'events',
        events: getAllEvents(),
      },
      response => {
        logDebug(response);
      },
    );
  }
});

observer.observe(document.querySelector('header[role="banner"]'), {
  childList: true,
  characterData: true,
  subtree: true,
});

// Wait for processed events and paste their data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === 'showEvent') {
    let event = request.event;
    // addDescription(event.id, html);
  }
});
