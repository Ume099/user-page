export const isPast10PMOfPreviousDay = (year: number, month: number, day: number) => {
  const now = new Date();
  const previousDay10PM = new Date(year, month - 1, day - 1, 21, 0, 0);
  return now > previousDay10PM;
};
