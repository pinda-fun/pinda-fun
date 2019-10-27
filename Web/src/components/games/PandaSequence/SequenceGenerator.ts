import seedrandom from 'seedrandom';
import { Sequence } from './Sequence';

const LENGTH_GROWTH_CONSTANT = 1;
const LENGTH_LIMIT = 5;
const TIMESTEP_REDUCTION_FACTOR = 0.8;

/**
 * Generator that yields a number between the lowerbound (inclusive) and upper
 * bound (exclusive) with a predefined seed.
 */
export function* randomWithinBounds(
  lowerBound: number,
  upperBound: number,
  seed: string = Date.now().toLocaleString(),
): Generator<number, number, void> {
  const random = seedrandom(seed);
  while (true) yield Math.floor(random() * (upperBound - lowerBound) + lowerBound);
}

/**
 * Generates a sequence of numbers using generator provided, scaled to be longer
 * and faster than the old sequence.
 */
export const generate = (prevSequence: Sequence, generator: Generator):Sequence => {
  const lastTimestep = prevSequence.timestep;
  const lastLength = prevSequence.numbers.length;

  const nums = [];
  const length = Math.min(LENGTH_LIMIT, Math.floor(lastLength + LENGTH_GROWTH_CONSTANT));
  for (let i = 0; i < length; i += 1) {
    nums.push(generator.next().value);
  }

  const newSeq: Sequence = {
    timestep: lastTimestep * TIMESTEP_REDUCTION_FACTOR,
    numbers: nums,
  };

  return newSeq;
};
