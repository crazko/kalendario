import { messages, logDebug } from './utils';
import initialize, { revokeTokens, invalidTokens } from './api/authorization';
import { getCalendars, getEvent, sendEventToContent } from './api/calendar';
import { IEvent, EventsMessage } from './event';

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    initialize();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.msg) {
    case messages.FETCH_EVENTS:
      if (invalidTokens()) {
        revokeTokens();
      }
      const req = request as EventsMessage;
      const calendars = getCalendars();

      req.data.events.forEach(event => {
        const calendarId = calendars[event.calendarName];

        getEvent(calendarId, event.id)
          .then(event => {
            sendEventToContent(event, messages.SHOW_EVENT);
          })
          .catch(error => {
            logDebug(error);
          });
      });

      break;
  }
});
