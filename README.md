# Calex

[![Greenkeeper badge](https://badges.greenkeeper.io/crazko/calex.svg)](https://greenkeeper.io/)

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

- `npm start`
- `npm run dev`
- `npm run build`
- `./release.sh`

---

This is a new version of [previous one](https://github.com/crazko/calex-classic) developed for classic Google Calenda not available anymore.
