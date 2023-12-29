import generateDurationWeeks from '../../utils/generateDurationWeeks';

export const calculateDurationWeeks = (
  startDateString: string,
  endDateString: string,
) => {
  if (startDateString && endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    // get millisecond
    const milliseconds = endDate.getTime() - startDate.getTime();
    // calculate millisecond to weeks
    const durationInWeeks = generateDurationWeeks(milliseconds);
    return durationInWeeks;
  }
};
