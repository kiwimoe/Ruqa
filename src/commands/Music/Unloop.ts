import type { Message } from "eris";
import checkIfActive from "@funcs/checkIfActive";
import createEmbedPost from "@funcs/createEmbedPost";
import Command from "@command";

export default new Command({
    name: "unloop",
    aliases: ["unl"],
    description: "Unloop the track or queue",
    category: "Music",
    requirements: ["insideVC", "sameVC"],
    permissions: ["none"],

    run: async ({ message }: {
        message: Message,
    }) => {
        const [player, has] = await checkIfActive(message);
        if (!has) {
            return;
        }
        if (player.trackRepeat || player.queueRepeat) {
            await createEmbedPost(message, `Disabled ${player.trackRepeat ? "track" : "queue"} repeat.`);
        } else {
           await createEmbedPost(message, "There isn't any loop mode enabled yet."); 
        }
    },
});
