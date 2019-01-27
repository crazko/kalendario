export const logger = (...args: any[]) => {
  // @ts-ignore - defined in webpack config
  if (DEBUG && console && console.log) {
    args.unshift('[calex]');
    console.log.apply(console, args);
  }
};
