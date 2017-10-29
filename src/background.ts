import { logDebug } from './utils';
import initialize, { revokeTokens } from './api/authorization';
import { getEvent, sendEvent, getCalendarList } from './api/calendar';

/* ----------------------------------------------------- */

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    initialize();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === 'events') {
    if (
      typeof localStorage['expiration'] === 'undefined' ||
      localStorage['expiration'] < new Date().getTime()
    ) {
      revokeTokens();
    }

    const events = request.events;
    const calendars = JSON.parse(localStorage['calendars']);

    for (let i = 0, len = events.length; i < len; i++) {
      const calendar = calendars[events[i].calendarName];

      getEvent(calendar, events[i].id)
        .then(event => {
          sendEvent(event, 'showEvent');
        })
        .catch(error => {
          logDebug(error);
        });
    }
  }
});

getCalendarList();
