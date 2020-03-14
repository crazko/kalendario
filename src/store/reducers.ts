import { combineReducers } from 'redux';
import { Action, type } from './actions';
import { Events } from '../app/event';
import { Calendars } from '../app/calendar';

const calendars = (state: Calendars = {}, action: Action) => {
  switch (action.type) {
    case type.ADD_CALENDAR_LIST:
      return action.calendarList;
    default:
      return state;
  }
};

const fetchingEvents = (state: string[] = [], action: Action) => {
  switch (action.type) {
    case type.FETCH_EVENT:
      return Array.from(new Set([...state, action.id]));
    case type.ADD_EVENT:
      return state.filter(id => id !== action.id);
    default:
      return state;
  }
};

const events = (state: Events = {}, action: Action) => {
  switch (action.type) {
    case type.ADD_EVENT:
      return {
        ...state,
        [action.id]: {
          id: action.id,
          description: action.description,
        },
      };
    default:
      return state;
  }
};

type State = ReturnType<typeof reducers>;

export const reducers = combineReducers({
  calendars,
  events,
  fetchingEvents,
});

// Selectors

export const getEvent = (state: State, eventId: string) =>
  state.events[eventId];

export const isEventProcessed = (state: State, eventId: string) =>
  state.fetchingEvents.includes(eventId);

export const getCalendarByName = (state: State, calendarName: string) =>
  Object.values(state.calendars).find(
    calendar => calendar?.name === calendarName,
  );
