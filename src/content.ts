import { messages, logDebug } from './utils';
import { getAllEvents, addDescriptionToEvent, GapiEventMessage } from './event';

// Check for change in calendar.
// Gather all events and send them to background to process
const observer = new MutationObserver(mutations => {
  chrome.runtime.sendMessage(
    {
      msg: messages.FETCH_EVENTS,
      data: {
        events: getAllEvents(),
      },
    },
    response => {},
  );
});

observer.observe(document.querySelector('div[role="main"]').parentElement, {
  childList: true,
  subtree: true,
});

// Wait for processed events and paste their data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.msg) {
    case messages.SHOW_EVENT:
      const req = request as GapiEventMessage;

      addDescriptionToEvent(req.data.event.id, req.data.event.description);
      break;
  }
});
