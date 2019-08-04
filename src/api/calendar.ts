import { apiUrl } from './authorization';

export async function fetchCalendarList(): Promise<
  gapi.client.calendar.CalendarList
> {
  const calendars = await fetch(apiUrl.calendarList, {
    method: 'GET',
    headers: {
      Authorization: `Bearer  ${localStorage['access_token']}`,
    },
  });

  return await calendars.json();
}

export async function fetchEvent(
  calendarId: string,
  eventId: string,
): Promise<gapi.client.calendar.Event> {
  const event = await fetch(
    `${apiUrl.calendar}/${calendarId}/events/${eventId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer  ${localStorage['access_token']}`,
      },
    },
  );

  return await event.json();
}
