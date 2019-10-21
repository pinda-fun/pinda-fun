import { useState } from 'react';
import seedrandom from 'seedrandom';
import { Sequence } from './Sequence';

const INITIAL_LENGTH = 5; // length of each memory sequence
const INITIAL_TIMESTEP = 500; // duration of each timestep
const LENGTH_FACTOR = 1.2;
const TIMESTEP_FACTOR = 0.8;

function* randomWithinBounds(seed:string, lowerBound:number, upperBound:number)
  :Generator<number, number, void> {
  const random = seedrandom(seed);
  while (true) {
    const x = Math.floor(random() * (upperBound - lowerBound) + lowerBound);
    yield x;
  }
}

/**
 * Takes in a seed and returns randomly generated Sequences of numbers between
 * the range of lowerBound and upperBound.
 */
export default function UseSeqGenerator(
  seed = Date.now().toString(),
  lowerBound = 1,
  upperBound = 5,
) {
  const [generator] = useState(randomWithinBounds(seed, lowerBound, upperBound));
  const [count, setCount] = useState(0);
  const [sequences, setSequences] = useState(Array<Sequence>());

  const generate = ():Sequence => {
    const lastTimestep = sequences.length === 0
      ? INITIAL_TIMESTEP : sequences[count - 1].timestep;
    const lastLength = sequences.length === 0
      ? INITIAL_LENGTH : sequences[count - 1].numbers.length;

    const nums = [];
    for (let i = 0; i < Math.floor(lastLength * LENGTH_FACTOR); i += 1) {
      nums.push(generator.next().value);
    }
    const newSeq:Sequence = {
      timestep: lastTimestep * TIMESTEP_FACTOR,
      numbers: nums,
    };

    setSequences(prevSeq => [...prevSeq, newSeq]);
    setCount(oldCount => oldCount + 1);
    return newSeq;
  };

  return { generate };
}
