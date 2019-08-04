import { combineReducers } from 'redux';
import { Action, type } from './actions';
import { Events } from '../app/event';

const fetching = (state: string[] = [], action: Action) => {
  switch (action.type) {
    case type.FETCH_EVENT:
      return Array.from(new Set([...state, action.eventId]));
    case type.ADD_EVENT:
      return state.filter(eventId => eventId !== action.event.id);
    default:
      return state;
  }
};

const events = (state: Events = {}, action: Action) => {
  switch (action.type) {
    case type.ADD_EVENT:
      return { ...state, [action.event.id]: action.event };
    default:
      return state;
  }
};

type State = ReturnType<typeof reducers>;

export const reducers = combineReducers({
  fetching,
  events,
});

// Selectors

export const getEvent = (state: State, eventId: string) =>
  state.events[eventId];

export const isEventProcessed = (state: State, eventId: string) =>
  state.fetching.includes(eventId);
