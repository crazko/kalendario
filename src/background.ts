import { initialize, revokeTokens, tokenExpired } from './api/authorization';
import { fetchEvent, fetchCalendarList } from './api/calendar';
import { isCalendarIdValid, normalizeCalendarList } from './app/calendar';
import { message, Request } from './app/runtime';

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    initialize();
  }
});

chrome.runtime.onMessage.addListener((request: Request, sender, sendResponse) => {
  (async () => {
    if (tokenExpired()) {
      await revokeTokens();
    }

    switch (request.message) {
      case message.FETCH_CALENDAR_LIST:
        try {
          const calendarList = await fetchCalendarList();
          sendResponse(normalizeCalendarList(calendarList));

          console.log('Sending calendar list');
        } catch (error) {
          console.error(error);
        }

        break;

      case message.FETCH_EVENT:
        const { calendarId, eventId } = request;

        if (!isCalendarIdValid(calendarId)) {
          sendResponse({
            id: eventId,
            description: undefined,
          });

          console.log(`Event '${eventId}' doesn't have proper calendar '${calendarId}'.`);

          break;
        }

        try {
          const event = await fetchEvent(calendarId, eventId);

          sendResponse({
            id: eventId,
            description: event.description,
          });

          console.log(`Sending event "${event.summary}" with ID "${event.id}".`);
        } catch (error) {
          console.error(error);
        }

        break;
    }
  })();

  // Signalize asynchronous call of `sendResponse`
  // @see https://developer.chrome.com/extensions/messaging#simple
  return true;
});
