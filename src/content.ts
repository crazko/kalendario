import { messages, logDebug } from './utils';
import { getAllEvents, addDescriptionToEvent } from './event';

// Check for change in calendar.
// Gather all events and send them to background to process
const observer = new MutationObserver(mutations => {
  const events = getAllEvents();

  chrome.runtime.sendMessage(
    {
      msg: messages.EVENTS,
      events,
    },
    // response => {
    //   logDebug(response);
    // },
  );
});

observer.observe(document.querySelector('div[role="main"]').parentElement, {
  childList: true,
  characterData: true,
  subtree: true,
});

interface IMessage {
  msg: string;
}

interface IEventMessage extends IMessage {
  event: gapi.client.calendar.Event;
}

// Wait for processed events and paste their data
chrome.runtime.onMessage.addListener((request: IEventMessage, sender, sendResponse) => {
  switch (request.msg) {
    case messages.SHOW_EVENT:
      addDescriptionToEvent(request.event.id, request.event.description);
      break;
  }
});
