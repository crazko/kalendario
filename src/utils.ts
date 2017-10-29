const debug = true;

export const logDebug = (...args: any[]) => {
  if (debug && console && console.log) {
    console.log.apply(console, args);
  }
};
