import * as phoenix from phoenix;

// Use Module augmentation to use "private" attribute state
declare module 'phoenix' {
  interface Presence<T extends object> {
    state: T;
  }
}
