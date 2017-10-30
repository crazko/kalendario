import { messages, logDebug } from './utils';
import initialize, { revokeTokens } from './api/authorization';
import { getCalendars, getEvent, sendEventToContent } from './api/calendar';
import { IEvent } from 'event';

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    initialize();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === messages.EVENTS) {
    if (
      typeof localStorage['expiration'] === undefined ||
      localStorage['expiration'] < new Date().getTime()
    ) {
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
  }
});
