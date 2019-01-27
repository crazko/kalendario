import { messages, logDebug } from './utils';
import { initialize, revokeTokens, invalidTokens } from './api/authorization';
import { getCalendars, getEvent, sendEventToContent } from './api/calendar';
import { EventsMessage } from './event';

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
      const summaries = [] as string[];

      req.data.events.forEach(event => {
        const calendarId = calendars[event.calendarName];

        sendEventToContent(
          {
            id: event.id,
            summary: 'foo' + Math.floor(Math.random() * 1000),
            description: 'foo' + Math.floor(Math.random() * 1000),
          },
          messages.SHOW_EVENT,
        );

        // getEvent(calendarId, event.id)
        //   .then(event => sendEventToContent(event, messages.SHOW_EVENT))
        //   .then(summary => {
        //     logDebug(summary);
        //   })
        //   .catch(error => {
        //     logDebug(error);
        //   });
      });

      break;
  }
});
