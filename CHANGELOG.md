# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.3.3] - 2022-04-24

### Fixed

- remove unnecessary `tabs` permission

## [0.3.2] - 2020-04-10

### Added

- available for download also for [Firefox](https://addons.mozilla.org/firefox/addon/kalendario-for-google-calendar/)

### Fixed

- token refresh before event requests [#50]
- initial loading of events [#52]

## [0.3.1] - 2019-09-09

Minor changes related to Chrome Web Store update

## [0.3.0] - 2019-09-09

### Added

- extension homepage https://kalendario.org
- privacy policy https://kalendario.org/privacy-policy
- releases in the [Releases section](https://github.com/crazko/kalendario/releases), the most recent version is for [download on Chrome Store](https://chrome.google.com/webstore/detail/ccoehijdbponhcemihobmdpaeenmgchg)

### Changed

- moved to new version of Google Calendar
- rewritten in typescript

### Removed

- markdown support (probably temporarily)

## [0.2.2] - 2018-01-13

### Fixed

- inaccessible markdown converter

## [0.2.1] - 2017-11-01

Currently, this extension isn't compatible with new Material Design of Google calendar, but still works with older "Classic" Calendar as long as it is available. New version of the extension is under development.

## [0.2.0] - 2017-04-11

### Added

- release script

### Changed

- Showdown.js - a markdown parser library to v1.6.3
- options of markdown parser:
  - parses urls automatically
  - header's id is not generated
  - strikethrough is enabled
- `<blockquote>` style

## [0.1.1] - 2017-02-11

### Added

- short extension name

### Changed

- oauth data

## [0.1.0] - 2017-02-11

### Added

- initial version
