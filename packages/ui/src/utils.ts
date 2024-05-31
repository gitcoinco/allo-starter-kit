export const getDaysLeft = (fromNowToTimestampStr: string) => {
  const targetTimestamp = Number(fromNowToTimestampStr);

  // Some timestamps are returned as overflowed (1.15e+77)
  // We parse these into undefined to show as "No end date" rather than make the date diff calculation
  if (targetTimestamp > Number.MAX_SAFE_INTEGER) {
    return undefined;
  }

  // TODO replace with differenceInCalendarDays from 'date-fns'
  const currentTimestampInSeconds = Math.floor(Date.now() / 1000); // current timestamp in seconds
  const secondsPerDay = 60 * 60 * 24; // number of seconds per day

  const differenceInSeconds = targetTimestamp - currentTimestampInSeconds;
  const differenceInDays = Math.floor(differenceInSeconds / secondsPerDay);

  return differenceInDays;
};
