import type { Message } from "eris";
import type { Player } from "vulkava";
import ruqa from "@root";
import RichEmbed from "@embed";

export default async (messageClass: Message): Promise<[Player, boolean]> => {
    const player = ruqa.audio.players.get(messageClass.guildID!);
    if (!player || !player?.current) {
        await messageClass.channel.createMessage({
            embeds: [
                new RichEmbed()
                .setColor(RichEmbed.embedColor)
                .setDescription("I'm nothing playing right now."),
            ],
        });
        return [player!, false];
    }
    return [player!, true];
};
