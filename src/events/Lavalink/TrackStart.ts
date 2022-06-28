import { type ComponentInteraction, type User } from "eris";
import type { Player, Track } from "vulkava";
import ruqa from "@root";
import RichEmbed from "@embed";
import Logger from "@logger";
import PlayerEvent from "@player_event";
import ComponentCollector from "@collector";
import trackSendRow from "@components/TrackStartState";
import nowplayingSendRow from "@components/NowplayingState";

export default new PlayerEvent("trackStart", async (player: Player, track: Track) => {
    const embed = new RichEmbed()
    .setColor(RichEmbed.embedColor)
    .setTitle("Now playing")
    .setDescription(track.title);

    ruqa.cachedTrackStartMsg = await ruqa.createMessage(
        player.textChannelId!,
        {
            embeds: [embed],
            components: [trackSendRow],
        },
    );
    const filter = (i: ComponentInteraction) => (
        i.member!.id === (player.current?.requester as User).id
    );
    const collector = new ComponentCollector(ruqa, ruqa.cachedTrackStartMsg, filter, { time: 0 });

    collector.on("collect", async (interaction: ComponentInteraction) => {
        switch (interaction.data.custom_id) {
            case "pause":
                if (player.paused) {
                    (nowplayingSendRow.components[0] as { label: string }).label = "Pause";
                    nowplayingSendRow.components[1].disabled = false;
                    (trackSendRow.components[0] as { label: string }).label = "Pause";
                    trackSendRow.components[1].disabled = false;
                    player.pause(false);
                    if (ruqa?.cachedTrackStartMsg) {
                        ruqa.cachedTrackStartMsg.edit({
                            components: [trackSendRow],
                        });
                    }
                    if (ruqa?.cachedNowplayingMsg) {
                        await ruqa.cachedNowplayingMsg.edit({
                            components: [nowplayingSendRow],
                        });
                    }
                } else {
                    (nowplayingSendRow.components[0] as { label: string }).label = "Resume";
                    nowplayingSendRow.components[1].disabled = true;
                    (trackSendRow.components[0] as { label: string }).label = "Resume";
                    trackSendRow.components[1].disabled = true;
                    player.pause(true);
                    if (ruqa?.cachedTrackStartMsg) {
                        await ruqa.cachedTrackStartMsg.edit({
                            components: [trackSendRow],
                        });
                    }
                    if (ruqa?.cachedNowplayingMsg) {
                        await ruqa.cachedNowplayingMsg.edit({
                            components: [nowplayingSendRow],
                        });
                    }
                }
                break;

            case "skip":
                if (player.queue.length < 1) {
                    await interaction.createMessage({
                        embeds: [
                            new RichEmbed()
                            .setColor(RichEmbed.embedColor)
                            .setDescription("Queue must have more than 1 track to skip."),
                        ],
                        flags: 64,
                    });
                    return;
                }
                await ruqa.cachedTrackStartMsg.delete();
                player.skip();
                break;

            case "stop":
                await ruqa.cachedTrackStartMsg.delete();
                player.destroy();
                break;

            default:
                Logger.warn(`Emitted an unknown custom id: ${interaction.data.custom_id}`);
                break;
        }
    });
});
