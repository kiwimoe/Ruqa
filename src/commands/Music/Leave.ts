import type { Message } from "eris";
import ruqa from "@root";
import createEmbedPost from "@funcs/createEmbedPost";
import Command from "@command";

export default new Command({
    name: "leave",
    aliases: ["lost"],
    description: "Destroy any existing connection and leave voice channel",
    category: "Music",
    example: "leave",
    requirements: ["insideVC", "sameVC"],
    permissions: ["none"],

    run: async ({ message }: {
        message: Message,
    }) => {
        const player = ruqa.audio.players.get(message.guildID!);
        if (!player) {
            await createEmbedPost(message, "I'm not connected with any voice channel");
            return;
        }
        player.destroy();
        player.disconnect();
        await createEmbedPost(message, `Left <#${message.member?.voiceState.channelID}>`);
    },
});
