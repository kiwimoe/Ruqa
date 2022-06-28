import type { PlayerEventTypes } from "vulkava/lib/@types";

export default class PlayerEvent<Key extends keyof PlayerEventTypes> {
    // eslint-disable-next-line no-useless-constructor
  constructor(
    public name: Key,
    public run: (...args: PlayerEventTypes[Key]) => any
  ) { }
}
