export const numbersFractionCalculator = (numbers: number[]) => {
  const result = numbers.reduce(
    (accumulator, currentValue) => {
      if (currentValue < 0) {
        accumulator.negative += 1 / numbers.length;
      } else if (currentValue === 0) {
        accumulator.zeros += 1 / numbers.length;
      } else {
        accumulator.positives += 1 / numbers.length;
      }

      return accumulator;
    },
    { // initial values
      positives: 0,
      negative: 0,
      zeros: 0,
    }
  );

  return {
    positives: result.positives.toFixed(6),
    negative: result.negative.toFixed(6),
    zeros: result.zeros.toFixed(6),
  };
};
