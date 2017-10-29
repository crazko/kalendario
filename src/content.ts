const addDescription = (eventId: string, description: string) => {
	// let $event = $('#' + eventId);

  // Avoid duplicated content
//   if ($event.find('.calex__description')) {
    // $event.find('.calex__description').remove();
//   }

//   $event.append(`<div class="calex__description">${description}</div>`);
}

/**
 * Gets all events from calendar.
 */
const getAllEvents = () => {
  const rows = document.querySelectorAll('div[role="row"]');

  return Array.from(rows)
    .filter((row) => row.children[1] && row.children[1].children.length === 3)
    .map((event) => {
      const eventElement = event.children[1].children[1].children[0] as HTMLElement;
      const calendarElement = event.children[1].children[2].children[0] as HTMLElement;

      const eventid = atob(eventElement.dataset.eventid);
      const data = eventid.split(' ');

      return {
        id: data[0],
        calendarName: calendarElement.dataset.text
      }
  });
}

/* ----------------------------------------------------- */

const calendarContainer = document.querySelector('header[role="banner"]');

// Check for change in calendar.
// Gather all events and send them to background to process
const observer = new MutationObserver(function(mutations) {

  if (document.querySelector('div[role="grid"]') !== null) {
    chrome.runtime.sendMessage({
      msg: 'events',
      events: getAllEvents()
    }, function(response) {
      // console.log(response);
    });
  };
});

observer.observe(calendarContainer, {
  childList: true,
  characterData: true,
  subtree: true
});

// Wait for processed events and paste their data
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg === 'show') {
    let event = request.event;
    console.log(event.description)
    // addDescription(event.id, html);
  }
});
