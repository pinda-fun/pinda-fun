import { useRef, useCallback } from 'react';
import seedrandom from 'seedrandom';
import { Sequence } from './Sequence';

const INITIAL_LENGTH = 2; // length of each memory sequence
const INITIAL_TIMESTEP = 1000; // duration of each timestep
const LENGTH_FACTOR = 1;
const TIMESTEP_FACTOR = 0.8;

function* randomWithinBounds(seed: string, lowerBound: number, upperBound: number)
  : Generator<number, number, void> {
  const random = seedrandom(seed);
  while (true) yield Math.floor(random() * (upperBound - lowerBound) + lowerBound);
}

/**
 * Takes in a seed and returns randomly generated Sequences of numbers between
 * the range of lowerBound and upperBound.
 */
export default function useSeqGenerator(
  seed = Date.now().toString(),
  lowerBound = 1,
  upperBound = 5,
) {
  const generator = useRef(randomWithinBounds(seed, lowerBound, upperBound)).current;
  const sequence = useRef<Sequence | null>(null);

  const generate = useCallback(() => {
    const lastTimestep = sequence.current === null ? INITIAL_TIMESTEP : sequence.current.timestep;
    const lastLength = sequence.current === null ? INITIAL_LENGTH : sequence.current.numbers.length;

    const nums = [];
    for (let i = 0; i < Math.floor(lastLength + LENGTH_FACTOR); i += 1) {
      nums.push(generator.next().value);
    }

    const newSeq: Sequence = {
      timestep: lastTimestep * TIMESTEP_FACTOR,
      numbers: nums,
    };

    sequence.current = newSeq;
    return newSeq;
  }, [generator]);

  return { generate };
}
