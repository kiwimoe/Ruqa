import { env } from "process";
import ruqa from "@root";
import GatewayEvent from "@gateway_event";
import Logger from "@logger";
import cast from "@funcs/cast";
import type { Tag } from "@typings/Tag";

export default new GatewayEvent("ready", () => {
    ruqa.audio.start(env.DEVMODE! === "true" ? env.DEV_BOT_ID! : env.BOT_ID!);
    ruqa.editStatus("online", { name: "?help", type: 0 });
    Logger.ok(`Logged in as ${cast<Tag>(ruqa.user).tag}`);
});
