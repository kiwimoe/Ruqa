import type { ClientEvents } from "eris";

export default class Event<Key extends keyof ClientEvents> {
    // eslint-disable-next-line no-useless-constructor
    constructor(
        public name: Key,
        public run: (...args: ClientEvents[Key]) => any,
    ) { }
}
