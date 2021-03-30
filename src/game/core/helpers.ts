/**
  Returns ABS random integer (crutch-fix to avoid values like "-0")
*/
export const getRandomInt = (min: number, max: number) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);

  rand = Math.round(rand);

  return rand;
};

/**
  Let's sleep a little-bit
*/
export const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
