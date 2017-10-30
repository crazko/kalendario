import { logDebug } from './utils';
import { getAllEvents, addDescriptionToEvent } from './event';

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

observer.observe(document.querySelector('div[role="main"]'), {
  childList: true,
  characterData: true,
  subtree: true,
});

// Wait for processed events and paste their data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === 'showEvent') {
    // addDescriptionToEvent(request.event.id, html);
    console.log(request.event);
  }
});
