import type { Player, Track } from "vulkava";
import ruqa from "@root";
import PlayerEvent from "@player_event";
import RichEmbed from "@embed";

export default new PlayerEvent("trackException", async (player: Player, track: Track) => {
    if (player.queue.length > 0) {
        await ruqa.createMessage(player.textChannelId!, {
            embeds: [
                new RichEmbed()
                .setColor(RichEmbed.embedColor)
                .setDescription(`${track.title} hit with an exception error. Skipping current playback...`),
            ],
        });
        player.skip();
    } else {
        await ruqa.createMessage(player.textChannelId!, {
            embeds: [
                new RichEmbed()
                .setColor(RichEmbed.embedColor)
                .setDescription(`${track.title} hit with an exception error. Destroying the player...`),
            ],
        });
        player.destroy();
    }
});
