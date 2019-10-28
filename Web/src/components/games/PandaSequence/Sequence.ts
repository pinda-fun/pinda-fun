export interface Sequence {
  timestep: number,
  numbers: number[],
}

export enum Feedback {
  NONE,
  CORRECT,
  WRONG,
}

export enum PandaSequenceMode {
  INPUT,
  DISPLAY,
}
