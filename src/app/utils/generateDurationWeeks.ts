const generateDurationWeeks = (milliseconds: number) => {
  // calculate millisecond to weeks
  return Math.ceil(milliseconds / (7 * 24 * 60 * 60 * 1000));
};

export default generateDurationWeeks;
