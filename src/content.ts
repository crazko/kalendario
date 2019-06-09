import { getAllEvents, addDescriptionToEvent } from './actions/actions';
import { messages, GapiEventMessage } from './utils/definitions';

const sendMessage = () => {
  const events = getAllEvents();

  chrome.runtime.sendMessage(
    {
      msg: messages.FETCH_EVENTS,
      data: {
        events: events,
      },
    },
    response => {},
  );
};

const checkForEvents = setInterval(sendMessage, 2000);

// Wait for processed events and paste their data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.msg) {
    case messages.SHOW_EVENT:
      const req = request as GapiEventMessage;

      addDescriptionToEvent(req.data.event.id, req.data.event.description);
      break;
  }
});
