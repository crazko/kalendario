import { logDebug } from '../utils';
import { apiUrl } from './authorization';

interface ICalendars {
  [name: string]: string;
}

export const getCalendarList = () =>
  fetch(apiUrl.calendarList, {
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

export const getCalendars = (): ICalendars =>
  (localStorage['calendars'] && JSON.parse(localStorage['calendars'])) ||
  getCalendarList();

export const getEvent = (calendarId: string, eventId: string): Promise<{}> => {
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

export const sendEventToContent = (event: Object, message: string) => {
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
