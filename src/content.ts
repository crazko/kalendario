import { createStore } from 'redux';

import {
  CSSClass,
  mainElementSelector,
  mainElementParentID,
} from './app/types';
import { addEventDescription, getEventDataAttributes } from './app/event';
import { sendFetchEventMessage } from './app/runtime';
import { fetchEventAction, addEventAction } from './store/actions';
import { reducers, isEventProcessed, getEvent } from './store/reducers';

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
      observeRows(target);
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

      if (!event && !isEventProcessed(store.getState(), eventId)) {
        store.dispatch(fetchEventAction(eventId, calendarName));

        sendFetchEventMessage(
          {
            id: eventId,
            calendarName,
          },
          fetchedEvent => processFetchedEvent(fetchedEvent, row),
        );
      }

      addEventTimeout(row);
    } else {
      removeEventTimeout(row);
    }
  });
};

const calendarObserver = new MutationObserver(calendarObserverCallback);

window.addEventListener('load', () => {
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

const observeRows = (target: HTMLElement) => {
  const rows = Array.from(target.getElementsByClassName(CSSClass.eventRow));

  rows.forEach(row => rowsObserver.observe(row));
};

const processFetchedEvent = (
  event: gapi.client.calendar.Event,
  row: HTMLElement,
) => {
  const { id, description, organizer } = event;
  const calendarName = organizer && organizer.displayName;

  if (id) {
    store.dispatch(addEventAction(id, calendarName, description));

    if (description) {
      addEventDescription(row, description);
    }
  }
};

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
