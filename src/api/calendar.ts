import { logDebug } from '../utils';
import { apiUrl } from './authorization';

export const getCalendarList = () => {
  return fetch(apiUrl.calendarList, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer  ' + localStorage['access_token'],
    },
  })
    .then(response => response.json())
    .then(data =>
      data.items.reduce((list: any, calendar: any) => {
        list[calendar.summary] = calendar.id;
        return list;
      }, {}),
    )
    .then(parsedData => {
      const data = JSON.stringify(parsedData);
      localStorage['calendars'] = data;

      return data;
    })
    .catch(error => {
      logDebug(error);
    });
};

export const getCalendars = () =>
  (localStorage['calendars'] && JSON.parse(localStorage['calendars'])) ||
  getCalendarList();

/**
 * Fetches event's data from Google Calendar API.
 * @returns {Promise.<Object>} event
 */
export const getEvent = (calendarId: string, eventId: string) => {
  // Filter out default calendars, ie. Week number, Holidays
  if (!calendarId || calendarId.indexOf('#') > -1) {
    return Promise.reject(
      `Event '${eventId}' doesn't have proper calendar '${calendarId}'.`,
    );
  }

  return fetch(`${apiUrl.calendar}/${calendarId}/events/${eventId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer  ${localStorage['access_token']}`,
    },
  })
    .then(response => response.json())
    .catch(error => {
      logDebug(error);
    });
};

/**
 * Sends event data back to calendar page.
 */
export const sendEvent = (event: Object, message: string) => {
  // Do not send event without description
  if (!event.hasOwnProperty('description')) {
    return false;
  }

  chrome.tabs.query(
    {
      url: 'https://calendar.google.com/calendar*',
    },
    tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          msg: message,
          event: event,
        });
      });
    },
  );
};
