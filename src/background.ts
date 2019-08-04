import { initialize, revokeTokens, invalidTokens } from './api/authorization';
import { fetchEvent, fetchCalendarList } from './api/calendar';
import {
  isCalendarIdValid,
  getCalendarsFromLocalStorage,
  setCalendarsToLocalStorage,
} from './app/calendar';
import { message, Request } from './app/runtime';

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    initialize();
  }
});

chrome.runtime.onMessage.addListener(
  (request: Request, sender, sendResponse) => {
    if (invalidTokens()) {
      revokeTokens();
    }

    let calendars = getCalendarsFromLocalStorage();

    if (!calendars || (calendars && Object.keys(calendars).length <= 0)) {
      (async () => {
        try {
          const calendarList = await fetchCalendarList();
          setCalendarsToLocalStorage(calendarList);
          calendars = getCalendarsFromLocalStorage();
        } catch (error) {
          console.log(error);
        }
      })();
    }

    (async () => {
      switch (request.message) {
        case message.FETCH_EVENT:
          const event = request.event;
          const { id: eventId, calendarName } = event;
          const calendarId =
            calendarName && calendars && calendars[calendarName];

          if (!calendarId || !isCalendarIdValid(calendarId)) {
            console.log(
              `Event '${eventId}' doesn't have proper calendar '${calendarId}'.`,
            );

            sendResponse(event);

            break;
          }

          try {
            const event = await fetchEvent(calendarId, eventId);
            sendResponse(event);

            console.log(
              `Sending event "${event.summary}" with ID "${event.id}".`,
            );
          } catch (error) {
            console.log(error);
          }

          break;
      }
    })();

    // Signalize asynchronous call of `sendResponse`
    // @see https://developer.chrome.com/extensions/messaging#simple
    return true;
  },
);
