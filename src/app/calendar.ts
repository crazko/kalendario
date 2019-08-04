export type Calendars = Record<string, string | undefined>;

// Filter out default calendars, ie. Week number, Holidays
export const isCalendarIdValid = (calendarId: string) =>
  calendarId.indexOf('#') === -1;

export const setCalendarsToLocalStorage = (
  calendarList: gapi.client.calendar.CalendarList,
): void => {
  if (!calendarList.items) {
    return;
  }

  const calendars = calendarList.items.reduce((list: Calendars, calendar) => {
    if (calendar.summary) {
      list[calendar.summary] = calendar.id;
    }

    return list;
  }, {});

  localStorage['calendars'] = JSON.stringify(calendars);
};

export const getCalendarsFromLocalStorage = (): Calendars | undefined =>
  localStorage['calendars'] && JSON.parse(localStorage['calendars']);
