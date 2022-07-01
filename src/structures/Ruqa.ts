import "../lib/ModuleAlias";
import { resolve } from "node:path";
import { cwd, env } from "node:process";
import { promisify } from "node:util";
import { config } from "dotenv";
import glob from "glob";
import { Client, type Message } from "eris";
import { Vulkava } from "vulkava";
import ts from "typescript";
import Cache from "@utils/Cache";
import panic from "@utils/NodeExceptions";
import Logger from "@logger";
import nodes from "@config/nodes.json";
import "../lib/ErisPatch";

const promisedGlob = promisify(glob);
config({ path: resolve(".", ".env") });

export default class Ruqa extends Client {
    public commands?: Map<string, unknown>;

    public aliases?: Map<string, unknown>;

    public componentCollectors: Array<unknown>;

    constructor() {
        super(env.DEVMODE! === "true" ? env.DEVTOKEN! : env.TOKEN!, {
            allowedMentions: { everyone: false, roles: false, users: false },
            defaultImageSize: 1024,
            intents: ["guilds", "guildMessages", "guildVoiceStates"],
            maxShards: "auto",
            messageLimit: 0,
            restMode: true,
        });

        this.commands = new Map<string, unknown>();
        this.aliases = new Map<string, unknown>();
        this.componentCollectors = [];
    }

    public async linkGateway(): Promise<void> {
        Logger.debug(`Starting up, Bot: v${env.BOT_VERSION ?? " N/A"}, TypeScript: v${ts.version}`);
        this.cache = new Cache<any>();
        await super.connect();
        await this.loadCommands();
        await this.loadGatewayEvents();
        await this.linkVulkava();
        await this.loadLavalinkEvents();

        if (env.DEVMODE !== "true") {
            this.ignoredErrors();
        }
    }

    private async loadCommands(): Promise<void> {
        const commands = await promisedGlob(`${cwd()}/dist/commands/**/*.js`);
        if (!commands.length) {
            panic("Failed to iterate commands directory in wildcard mode.");
            return;
        }
        for (const eachCmd of commands) {
            const cmd = (await import(eachCmd)).default;
            this.commands?.set(cmd.name, cmd);
            cmd.aliases?.forEach((e: string) => {
                this.aliases?.set(e, cmd);
            });
        }
        Logger.ok(`Loaded ${commands.length} commands`);
    }

    private async loadGatewayEvents(): Promise<void> {
        const events = await promisedGlob(`${cwd()}/dist/events/Discord/*.js`);
        if (!events.length) {
            panic("Failed to read events directory in wildcard mode.");
            return;
        }
        for (const eachEvent of events) {
            const event = (await import(eachEvent)).default;
            this.on(event.name, event.run);
        }
        Logger.ok(`Loaded ${events.length} gateway events`);
    }

    private async linkVulkava(): Promise<void> {
        this.audio = new Vulkava({
            nodes,
            sendWS: (guildID, raw) => {
                this.guilds.get(guildID)?.shard.sendWS(raw.op, raw.d);
            },
        });
    }

    private async loadLavalinkEvents(): Promise<void> {
        const events = await promisedGlob(`${cwd()}/dist/events/Lavalink/*.js`);
        if (!events.length) {
            panic("Failed to read events directory in wildcard mode.");
            return;
        }
        for (const eachEvent of events) {
            const event = (await import(eachEvent)).default;
            this.audio.on(event.name, event.run);
        }
        Logger.ok(`Loaded ${events.length} lavalink events`);
    }

    private ignoredErrors(): void {
        ["uncaughtException", "uncaughtExceptionMonitor", "unhandledRejection"]
        .forEach((each) => {
            process.on(each, () => { });
        });
    }
}

declare module "eris" {
    export interface Client {
        audio: Vulkava;
        cache: Cache<any>;
        componentCollectors: Array<unknown>;
        cachedTrackStartMsg: Message;
        cachedNowplayingMsg: Message;
        usedCommandPause: boolean;
    }
}
