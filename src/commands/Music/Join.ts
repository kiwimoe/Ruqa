import type { Client, Message } from "eris";
import createEmbedPost from "@funcs/createEmbedPost";
import Command from "@command";

export default new Command({
    name: "join",
    aliases: ["connect"],
    description: "Connect with voice channel where you're already joined",
    category: "Music",
    example: "join",
    requirements: ["insideVC"],
    permissions: ["connect"],

    run: async ({ ruqa, message }: {
        ruqa: Client,
        message: Message,
    }) => {
        if (ruqa.audio?.players.get(message.guildID!)) {
            await createEmbedPost(message, `I'm already connected with <#${message.member?.voiceState.channelID}>`);
        } else {
            const player = ruqa.audio.createPlayer({
                guildId: message.guildID!,
                textChannelId: message.channel.id,
                voiceChannelId: message.member?.voiceState.channelID,
                selfDeaf: true,
            });
            player.connect();
            await createEmbedPost(message, `Connected with <#${message.member?.voiceState.channelID}>`);
        }
    },
});
