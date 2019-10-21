import { useState, useEffect } from "react";

export interface Problem {
  probAsString: string;
  expectedRes: number;
}

const operators: Array<[string, (a: number, b: number) => number]> = [
  ['+', (a, b) => a + b],
  ['-', (a, b) => a - b],
  ['×', (a, b) => a * b],
  ['÷', (a, b) => a / b]
]

const generateProblem =
  (opRand: number, termRand1: number, termRand2: number): Problem => {
    const formatted = (num: number) => num < 0 ? `(${num})` : `${num}`;
    const [opText, opFunc] = operators[opRand % 3];
    const firstTerm = Math.max(termRand1 % 7, termRand1 % 8) *
      (termRand1 % 2 === 0 ? 1 : -1);
    const secondTerm = Math.max(termRand2 % 5, termRand2 % 4) *
      (termRand2 % 2 === 0 ? 1 : -1);
    const [t1, t2] = (termRand1 + termRand2) % 2 === 0
      ? [firstTerm, secondTerm] : [secondTerm, firstTerm];
    return {
      probAsString: `${formatted(t1)} ${opText} ${formatted(t2)}`,
      expectedRes: opFunc(t1, t2),
    }
  };

export const useQuestionStream = (rng: seedrandom.prng) => {
  const [_rng] = useState([rng]); // need to box this or else it'll become a number
  const [problem, setProblem] = useState<Problem | null>(null);
  const [problemText, setProblemText] = useState('');
  const [expectedAns, setExpectedAns] = useState<number | null>(null);

  const nextProblem = () =>
    setProblem(generateProblem(
      Math.abs(_rng[0].int32()),
      Math.abs(_rng[0].int32()),
      Math.abs(_rng[0].int32()),
    ));

  useEffect(() => {
    setProblemText(problem === null ? '' : problem.probAsString);
    setExpectedAns(problem && problem.expectedRes);
  }, [problem]);

  return { problemText, expectedAns, nextProblem };
};
