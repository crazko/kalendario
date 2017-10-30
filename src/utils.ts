const debug = true;

export const messages = {
  EVENTS: 'events',
  SHOW_EVENT: 'showEvent',
};

export const logDebug = (...args: any[]) => {
  if (debug && console && console.log) {
    args.unshift('calex');
    console.log.apply(console, args);
  }
};
