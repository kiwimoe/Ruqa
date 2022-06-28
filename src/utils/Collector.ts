import EventEmitter from "node:events";
import type { Client, ComponentInteraction, Message } from "eris";
import type { CollectorOptions } from "@typings/CollectorOptions";

// eslint-disable-next-line no-unused-vars
declare function ComponentCollectorFilter(interaction: ComponentInteraction): boolean;

export default class ComponentCollector extends EventEmitter {
    public ruqa: Client;

    public message: Message;

    public filter?: typeof ComponentCollectorFilter;

    public timeout?: ReturnType<typeof setTimeout>;

    public interactionCount: number;

    public options?: CollectorOptions;

    constructor(
        ruqa: Client,
        message: Message,
        filter?: typeof ComponentCollectorFilter,
        options?: CollectorOptions,
    ) {
        super();
        this.ruqa = ruqa;
        this.message = message;
        this.filter = filter;
        this.interactionCount = 0;
        this.options = options;

        if (this.options?.time) {
            this.timeout = setTimeout(() => {
                this.stop("timeout");
                delete this.timeout;
            }, this.options.time);
        }

        ruqa.componentCollectors.push(this);
    }

    public collect(interaction: ComponentInteraction) {
        if (this.filter && this.filter(interaction)) {
            this.interactionCount++;
            this.emit("collect", interaction);
            if (this.options?.max && this.interactionCount === this.options.max) {
                this.stop("maximumLimit");
            }
        } else {
            interaction.createMessage({ content: "Only requester can access this buttons.", flags: 64 });
        }
    }

    public stop(reason?: string) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.emit("end", reason ?? "Forced");
        this.removeListener("collect", () => { });
        this.ruqa.componentCollectors.splice(this.ruqa.componentCollectors.indexOf(this), 1);
    }
}
