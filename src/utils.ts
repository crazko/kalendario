export interface IMessage<T> {
  msg: string;
  data: T;
}

const debug = true;

export const messages = {
  FETCH_EVENTS: 'fetchEvents',
  SHOW_EVENT: 'showEvent',
};

export const logDebug = (...args: any[]) => {
  if (debug && console && console.log) {
    args.unshift('calex');
    console.log.apply(console, args);
  }
};
