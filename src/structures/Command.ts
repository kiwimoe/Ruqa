import type { CommandOptions } from "../typings/CommandOptions";

export default class Command {
    constructor(options: CommandOptions) {
        Object.assign(this, options);
    }
}
