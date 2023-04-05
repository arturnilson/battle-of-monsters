const validateDice = (dice1: number, dice2: number, dice3: number) => {
  if (dice1 < 1 || dice1 > 6) {
    throw new Error('Dice out of number range');
  }

  if (dice2 < 1 || dice2 > 6) {
    throw new Error('Dice out of number range');
  }

  if (dice3 < 1 || dice3 > 6) {
    throw new Error('Dice out of number range');
  }
};

export const diceFacesCalculator = (
  dice1: number,
  dice2: number,
  dice3: number
): number => {
  validateDice(dice1, dice2, dice3);

  if (dice1 === dice2 && dice2 === dice3) {
    return dice1 * 3;
  } else if (dice1 === dice2 || dice1 === dice3) {
    return dice1 * 2;
  } else if (dice2 === dice1 || dice2 === dice3) {
    return dice2 * 2;
  } else if (dice3 === dice1 || dice3 === dice2) {
    return dice3 * 2;
  }

  return Math.max(dice1, dice2, dice3);
};
