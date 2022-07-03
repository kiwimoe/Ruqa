import type {
    Client,
    ComponentInteraction,
    Message,
    User,
} from "eris";
import prettyMs from "pretty-ms";
import nowplayingSendRow from "@components/NowplayingState";
import trackSendRow from "@components/TrackStartState";
import checkIfActive from "@funcs/checkIfActive";
import Command from "@command";
import ComponentCollector from "@collector";
import createProgressBar from "@utils/ProgressBar";
import RichEmbed from "@embed";
import wrapTryCatchError from "@funcs/wrapTryCatch";

export default new Command({
    name: "nowplaying",
    aliases: ["np"],
    description: "Shows what's now playing",
    category: "Music",
    requirements: ["insideVC"],
    permissions: ["none"],

    run: async ({ ruqa, message }: {
        ruqa: Client,
        message: Message,
    }) => {
        const [player, ret] = await checkIfActive(message);
        if (!ret) {
            return;
        }

        const track = player.current;
        const [bar, percentage] = createProgressBar(
            track?.isStream ? 1 : track?.duration ?? 0,
            track?.isStream ? 1 : player.position,
            track?.uri,
        );

        const embed = new RichEmbed()
        .setColor(RichEmbed.embedColor)
        .setAuthor(player.current?.title ?? "Unknown title", player.current?.uri)
        .setThumbnail(player.current?.identifier
        ? `https://img.youtube.com/vi/${player.current?.identifier}/default.jpg`
        : "")
        .setDescription(`\n\n**Author**: ${player?.current?.author}\n**Requester**: <@!${(player?.current?.requester as User).id}>\n**Duration**: ${player?.current?.isStream ? "Stream" : prettyMs(Number(player?.current?.duration), { verbose: true })}`)
        .addField("Upcoming", player?.queue[0]
        ? `[${player.queue[0].title}](${player.queue[0].uri})`
        : "There are no upcoming track(s) in the queue")
        .addField("Progress", `${bar}\n${player?.current?.isStream ? "Stream" : `${prettyMs(Number(player?.exactPosition), { verbose: true })} (${Number(percentage).toFixed(2)}%)`}`);

        const filter = (i: ComponentInteraction) => (
            i.member!.id === (player.current?.requester as User).id
        );
        ruqa.cachedNowplayingMsg = await message.channel.createMessage({
            embeds: [embed],
            components: [nowplayingSendRow],
        });
        const collector = new ComponentCollector(
            ruqa,
            ruqa.cachedNowplayingMsg,
            filter,
            { time: 0 },
        );

        collector.on("collect", async (interaction: ComponentInteraction) => {
            switch (interaction.data.custom_id) {
                case "np_pause_or_resume":
                    if (!player.paused) {
                        (nowplayingSendRow.components[0] as { label: string }).label = "Resume";
                        nowplayingSendRow.components[1].disabled = true;
                        (trackSendRow.components[0] as { label: string }).label = "Resume";
                        trackSendRow.components[1].disabled = true;
                        player.pause(true);
                        await ruqa.cachedNowplayingMsg.edit({ components: [nowplayingSendRow] });
                        await ruqa.cachedTrackStartMsg.edit({ components: [trackSendRow] });
                    } else {
                        (nowplayingSendRow.components[0] as { label: string }).label = "Pause";
                        nowplayingSendRow.components[1].disabled = false;
                        (trackSendRow.components[0] as { label: string }).label = "Pause";
                        trackSendRow.components[1].disabled = false;
                        player.pause(false);
                        await ruqa.cachedNowplayingMsg.edit({ components: [nowplayingSendRow] });
                        await ruqa.cachedTrackStartMsg.edit({ components: [trackSendRow] });
                    }
                    break;

                case "np_skip":
                    if (player.queue.length > 0) {
                        player.skip();
                        await ruqa.cachedNowplayingMsg.delete();
                    } else {
                        await interaction.createFollowup({ embeds: [new RichEmbed().setColor(RichEmbed.embedColor).setDescription("Queue must have more than 1 track to skip.")] });
                    }
                    break;

                case "np_refresh":
                    const embed = new RichEmbed()
                    .setColor(RichEmbed.embedColor)
                    .setAuthor(player.current?.title ?? "Unknown title", player.current?.uri)
                    .setThumbnail(player.current?.identifier
                        ? `https://img.youtube.com/vi/${player.current?.identifier}/default.jpg`
                        : "")
                    .setDescription(`\n\n**Author**: ${player?.current?.author}\n**Requester**: <@!${(player?.current?.requester as User).id}>\n**Duration**: ${player?.current?.isStream ? "Stream" : prettyMs(Number(player?.current?.duration), { verbose: true })}`)
                    .addField("Upcoming", player?.queue[0]
                    ? `[${player.queue[0].title}](${player.queue[0].uri})`
                    : "There are no upcoming track(s) in the queue")
                    .addField("Progress", `${bar}\n${player?.current?.isStream ? "Stream" : `${prettyMs(Number(player?.exactPosition), { verbose: true })} (${Number(percentage).toFixed(2)}%)`}`);
                    await ruqa.cachedNowplayingMsg.edit({ embeds: [embed] });
                    break;

                case "np_stop":
                    await wrapTryCatchError<void>(ruqa.cachedNowplayingMsg.delete());
                    player.destroy();
                    if (ruqa.cachedTrackStartMsg) {
                        await wrapTryCatchError<void>(ruqa.cachedTrackStartMsg.delete());
                    }
                    break;

                case "np_delete":
                    await wrapTryCatchError<void>(ruqa.cachedNowplayingMsg.delete());
                    break;
                }
        });
    },
});
