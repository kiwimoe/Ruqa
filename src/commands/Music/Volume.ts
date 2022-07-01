import type { Message } from "eris";
import Command from "@command";
import checkIfActive from "@funcs/checkIfActive";
import createEmbedPost from "@funcs/createEmbedPost";
import wrapTryCatchError from "@funcs/wrapTryCatch";
import emojis from "@config/emojis.json";

export default new Command({
    name: "volume",
    aliases: ["vol"],
    description: "Control the player volume",
    category: "Music",
    example: "volume [level]",
    requirements: ["insideVC", "sameVC"],
    permissions: ["none"],

    run: async ({ message, args }: {
        message: Message,
        args: string[],
    }) => {
        const [player, ret] = await checkIfActive(message);
        if (!ret) {
            return;
        }

        const level = args[0];
        if (Number.isNaN(Number(level))) {
            await createEmbedPost(message, "Volume level must be a number.");
            return;
        }
        if (Number(level) > 150 || Number(level) < 0) {
            await createEmbedPost(message, "Volume range must be lower than 150 and higher than 0.");
            return;
        }
        player.filters.setVolume(Number(level));
        await wrapTryCatchError<void>(message.addReaction(emojis.ok_hand));
    },
});
