# Calex
A browser extension that shows events' descriptions in Google Calendar.

Descriptions of the events are displayed in the agenda and search view.

## Installation
Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/calex-for-google-calendar/ccoehijdbponhcemihobmdpaeenmgchg).
![Calex in Google Calendar](docs/screenshot.png)

## Features

- shows descriptions in:
    - the agenda view
    - the search results

### Browsers
Tested in:

- [Chrome](https://www.google.com/chrome/)
- [Opera](https://www.opera.com/) (you can use Chrome extensions trough [Download Chrome Extensions](https://addons.opera.com/en/extensions/details/download-chrome-extension-9/) addon)
- [Vivaldi](https://vivaldi.com/)

## Development

- clone this repository
- checkout a new branch
- load directory as an unpacked extension (be sure you have enabled **developer mode**)
- you have to reload extension on every change you made

### Workflow:

1. get list of user calendars
    - parse calendars' ids
2. get all events from the page
    - their ids
    - calendar names
3. get event description
    - get calendar id from the list by its name
    - use event id and calendar id to get description

### API calls

- [CalendarList: list](https://developers.google.com/google-apps/calendar/v3/reference/calendarList/list)
- [Events: get](https://developers.google.com/google-apps/calendar/v3/reference/events/get)

