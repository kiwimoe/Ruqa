import type { Message } from "eris";
import checkIfActive from "@funcs/checkIfActive";
import createEmbedPost from "@funcs/createEmbedPost";
import Command from "@command";
import wrapTryCatchError from "@funcs/wrapTryCatch";
import emojis from "@config/emojis.json";

export default new Command({
    name: "skip",
    aliases: ["sk", "next"],
    description: "Skip the current playback",
    category: "Music",
    requirements: ["insideVC", "sameVC"],
    permissions: ["none"],

    run: async ({ message, args }: {
        message: Message,
        args: string[],
    }) => {
        const [player, has] = await checkIfActive(message);
        if (!has) {
            return;
        }
        if (!player.queue.length) {
            await createEmbedPost(message, "There are so songs in the queue to skip.");
            return;
        }
        const index = args[0] || 1;
        if (Number.isNaN(Number(index))) {
            await createEmbedPost(message, "Index must be a number.");
            return;
        }
        if (Number(index) > player.queue.length || Number(index) < player.queue.length) {
            await createEmbedPost(message, "Index range must be lower than the queue size and higher than zero.");
            return;
        }
        player.skip(Number(index) || undefined);
        await wrapTryCatchError<void>(message.addReaction(emojis.ok_hand));
    },
});
