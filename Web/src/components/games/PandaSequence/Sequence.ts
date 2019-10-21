export interface Sequence {
  timestep: number,
  numbers: number[],
}

export enum PandaSequenceMode {
  INPUT = 0,
  DISPLAY = 1,
}
