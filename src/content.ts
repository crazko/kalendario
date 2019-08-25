import { createStore } from 'redux';

import {
  CSSClass,
  mainElementSelector,
  mainElementParentID,
} from './app/types';
import { addEventDescription, getEventDataAttributes } from './app/event';
import {
  sendFetchEventMessage,
  sendFetchCalendarListMessage,
} from './app/runtime';
import {
  fetchEventAction,
  addEventAction,
  addCalendarListAction,
} from './store/actions';
import {
  reducers,
  isEventProcessed,
  getEvent,
  getCalendarByName,
} from './store/reducers';

let storeLogger;
let rowsObserver: IntersectionObserver;

const store = createStore(reducers);

if (__DEBUG__) {
  storeLogger = store.subscribe(() => console.log(store.getState()));
}

const calendarObserverCallback = (mutations: MutationRecord[]) => {
  mutations.forEach(mutation => {
    const target = mutation.target as HTMLElement;

    // One row has changed
    if (target.classList.contains(CSSClass.eventRow)) {
      rowsObserver.observe(target);
    }

    // All rows have been added at once
    if (target.querySelector(mainElementSelector)) {
      Array.from(target.getElementsByClassName(CSSClass.eventRow)).forEach(
        row => rowsObserver.observe(row),
      );
    }
  });
};

const rowsObserverCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(entry => {
    const row = entry.target as HTMLElement;
    const { eventId, calendarName } = getEventDataAttributes(row);

    if (entry.isIntersecting && eventId && calendarName) {
      const event = getEvent(store.getState(), eventId);

      if (event && event.description) {
        addEventDescription(row, event.description);
      }

      const calendar = getCalendarByName(store.getState(), calendarName);
      const calendarId = (calendar && calendar.id) || null;

      if (
        !event &&
        !isEventProcessed(store.getState(), eventId) &&
        calendarId
      ) {
        store.dispatch(fetchEventAction(eventId));

        sendFetchEventMessage(calendarId, eventId, fetchedEvent => {
          store.dispatch(
            addEventAction(fetchedEvent.id, fetchedEvent.description),
          );

          if (fetchedEvent.description) {
            addEventDescription(row, fetchedEvent.description);
          }
        });
      }

      addEventTimeout(row);
    } else {
      removeEventTimeout(row);
    }
  });
};

const calendarObserver = new MutationObserver(calendarObserverCallback);

window.addEventListener('load', () => {
  // Load calendars
  sendFetchCalendarListMessage(calendarList =>
    store.dispatch(addCalendarListAction(calendarList)),
  );

  // Start observing calendar
  const mainContentParent = document.getElementById(mainElementParentID);

  if (mainContentParent) {
    calendarObserver.observe(mainContentParent, {
      childList: true,
      subtree: true,
    });

    rowsObserver = new IntersectionObserver(rowsObserverCallback, {
      root: mainContentParent,
      threshold: 0,
    });
  } else {
    console.error(
      "[calex] Couldn't find events container element, try to reload the tab.",
    );
  }
});

/**
 * First load causes flash of event rows that removes previously added description.
 */
const addEventTimeout = (row: HTMLElement) => {
  const intervalData = row.dataset.interval;

  if (intervalData) {
    return;
  }

  const { eventId } = getEventDataAttributes(row);

  if (eventId) {
    const interval = window.setInterval(() => {
      const event = getEvent(store.getState(), eventId);

      if (event && event.description) {
        addEventDescription(row, event.description);
      }
    }, 1000);

    row.dataset.interval = String(interval);
  }
};

const removeEventTimeout = (row: HTMLElement) => {
  const intervalData = row.dataset.interval;

  if (!intervalData) {
    return;
  }

  window.clearInterval(Number(intervalData));
  delete row.dataset.interval;
};
