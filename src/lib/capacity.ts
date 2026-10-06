export const CAPACITY_MIN_GALLONS = 100;
export const CAPACITY_MAX_GALLONS = 5000;
export const CAPACITY_STEP_GALLONS = 50;

export function capacityGallonOptions(current?: number | null) {
  const options: number[] = [];
  for (let gallons = CAPACITY_MIN_GALLONS; gallons <= CAPACITY_MAX_GALLONS; gallons += CAPACITY_STEP_GALLONS) {
    options.push(gallons);
  }
  if (current && current > 0 && !options.includes(current)) {
    options.push(current);
    options.sort((a, b) => a - b);
  }
  return options;
}

export function isStandardCapacity(gallons: number) {
  return (
    Number.isInteger(gallons) &&
    gallons >= CAPACITY_MIN_GALLONS &&
    gallons <= CAPACITY_MAX_GALLONS &&
    gallons % CAPACITY_STEP_GALLONS === 0
  );
}
