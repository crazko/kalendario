import { messages, logDebug } from './utils';
import initialize, { revokeTokens, invalidTokens } from './api/authorization';
import { getCalendars, getEvent, sendEventToContent } from './api/calendar';
import { IEvent } from 'event';

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    initialize();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.msg) {
    case messages.EVENTS:
      if (invalidTokens()) {
        revokeTokens();
      }

      const calendars = getCalendars();

      request.events.forEach((event: IEvent) => {
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
