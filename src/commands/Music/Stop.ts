import type { Client, Message } from "eris";
import Command from "@command";
import checkIfActive from "@funcs/checkIfActive";
import wrapTryCatchError from "@funcs/wrapTryCatch";
import emojis from "@config/emojis.json";

export default new Command({
    name: "stop",
    aliases: ["die"],
    description: "Stop the current playback and leave voice channel",
    category: "Music",
    example: "stop",
    requirements: ["insideVC", "sameVC"],
    permissions: ["reactions"],

    run: async ({ ruqa, message }: {
        ruqa: Client,
        message: Message,
    }) => {
        const [player, has] = await checkIfActive(message);
        if (!has) {
            return;
        }
        ruqa.audio.emit("trackEnd", () => { });
        player.destroy();
        await wrapTryCatchError<void>(message.addReaction(emojis.ok_hand));
    },
});
