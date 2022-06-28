import type { Message } from "eris";
import checkIfActive from "@funcs/checkIfActive";
import createEmbedPost from "@funcs/createEmbedPost";
import Command from "@command";

export default new Command({
    name: "loop",
    aliases: ["lp"],
    description: "Loop the track or playlist",
    category: "Music",
    example: "loop [track | queue | unloop]",
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

        const mode = args[0];
        if (!mode) {
            await createEmbedPost(message, "You need to provide a loop mode name.");
            return;
        }

        switch (mode) {
            case "track":
                if (player.trackRepeat) {
                    player.setTrackLoop(false);
                } else {
                    player.setTrackLoop(true);
                }
                await createEmbedPost(message, `${player.trackRepeat ? "Enabled" : "Disabled"} track repeat.`);
                break;

            case "queue":
                if (player.queueRepeat) {
                    player.setQueueLoop(false);
                } else {
                    player.setQueueLoop(true);
                }
                await createEmbedPost(message, `${player.queueRepeat ? "Enabled" : "Disabled"} queue repeat.`);
                break;

            case "unloop":
                if (player.trackRepeat || player.queueRepeat) {
                    await createEmbedPost(message, `Disabled ${player.trackRepeat ? "track" : "queue"} repeat.`);
                } else {
                   await createEmbedPost(message, "There isn't any loop mode enabled yet."); 
                }
                break;

            default:
                await createEmbedPost(message, "Unknown type of loop mode was provided.");
                break;
        }
    },
});
