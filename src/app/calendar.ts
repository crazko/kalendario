export type Calendars = Record<string, ICalendar | undefined>;

interface ICalendar {
  id: string;
  name: string;
}

// Filter out default calendars, ie. Week number, Holidays
export const isCalendarIdValid = (calendarId: string) =>
  calendarId.indexOf('#') === -1;

export const normalizeCalendarList = (
  calendarList: gapi.client.calendar.CalendarList,
): Calendars => {
  if (!calendarList.items) {
    return {};
  }

  return calendarList.items.reduce((list: Calendars, calendar) => {
    if (calendar.id && calendar.summary) {
      list[calendar.id] = {
        id: calendar.id,
        name: calendar.summary,
      };
    }

    return list;
  }, {});
};
