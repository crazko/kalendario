export interface IMessage<T> {
  msg: string;
  data: T;
}

const debug = true;

export enum messages {
  FETCH_EVENTS = 'FETCH_EVENTS',
  SHOW_EVENT = 'SHOW_EVENT',
}

export const logDebug = (...args: any[]) => {
  if (debug && console && console.log) {
    args.unshift('calex');
    console.log.apply(console, args);
  }
};
