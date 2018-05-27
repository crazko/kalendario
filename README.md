# Calex
A browser extension that shows events' descriptions in Google Calendar.

Descriptions are displayed in:
- the agenda view
- the search results

![Calex in Google Calendar](docs/screenshot.png)

## Installation
Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/calex-for-google-calendar/ccoehijdbponhcemihobmdpaeenmgchg).

### Browsers
Tested in:

- [Chrome](https://www.google.com/chrome/)
- [Opera](https://www.opera.com/) (you can use Chrome extensions trough [Download Chrome Extensions](https://addons.opera.com/en/extensions/details/download-chrome-extension-9/) addon)
- [Vivaldi](https://vivaldi.com/)

## Development

- clone this repository `git clone git@github.com:crazko/calex.git`
- install all dependencies `npm install`
- build source files with `npm run dev`
- enable **Developer mode** in your browser
- load **./dist** directory as an unpacked extension

**Note:** you have to reload extension on every change you made

### Available commands

- `npm run dev`
- `npm run watch`
- `npm run prod`
- `./release.sh`
