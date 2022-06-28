import type {
    Client,
    ComponentInteraction,
    Message,
    User,
} from "eris";
import Command from "@command";
import checkIfActive from "@funcs/checkIfActive";
import createEmbedPost from "@funcs/createEmbedPost";
import Chunk from "@utils/Chunk";
import ComponentCollector from "@collector";
import RichEmbed from "@embed";
import queueSendRow from "@components/QueueState";
import Logger from "@logger";

export default new Command({
    name: "queue",
    aliases: ["q"],
    description: "Show the upcoming tracks",
    category: "Music",
    requirements: ["insideVC", "sameVC"],
    permissions: ["none"],

    run: async ({ ruqa, message }: {
        ruqa: Client,
        message: Message,
    }) => {
        const [player, has] = await checkIfActive(message);
        if (!has) {
            return;
        }
        if (!player.queue.length) {
            await createEmbedPost(message, "There aren't any tracks in the queue.");
            return;
        }

        const mapping = player?.queue.map((t, i) => `\`${++i}.\` [${t.title?.replaceAll("||", "")}](${t.uri}) - [<@!${(t.requester as User).id}>]`);
        const chunking = Chunk(mapping, 10);
        const pages = chunking.map((x: string[]) => x.join("\n"));
        const pagesLen = pages.length;
        let onPage = 0;
        if (onPage) {
            onPage = -1;
        }
        if (onPage > pagesLen) {
            onPage = 0;
        }
        if (onPage < 0) {
            onPage = 0;
        }

        const embed = new RichEmbed()
        .setDescription(`**Queued Tracks**\n\n${pages[onPage]}`)
        .setColor(RichEmbed.embedColor)
        .setFooter(`Page ${onPage + 1}/${pagesLen}`);

        if (player.queue.length <= 10) {
            queueSendRow.components[2].disabled = true;
            queueSendRow.components[3].disabled = true;
        } else {
            queueSendRow.components[2].disabled = false;
            queueSendRow.components[3].disabled = false;
        }
        const cachedMsg = await message.channel.createMessage({
            embeds: [embed],
            components: [queueSendRow],
        });
        const filter = (i: ComponentInteraction) => (
            i.member!.id === (player.current?.requester as User).id
        );
        const collector = new ComponentCollector(ruqa, cachedMsg, filter, { time: 0 });

        collector.on("collect", async (interaction: ComponentInteraction) => {
            switch (interaction.data.custom_id) {
                case "jmp_first":
                    onPage = 0;
                    queueSendRow.components[0].disabled = true;
                    queueSendRow.components[1].disabled = true;
                    queueSendRow.components[2].disabled = false;
                    queueSendRow.components[3].disabled = false;
                    embed.setDescription(`**Queued Tracks**\n\n${pages[onPage]}`)
                    .setFooter(`Page 1/${pagesLen}`);
                    await interaction.editParent({ embeds: [embed], components: [queueSendRow] });
                    break;

                case "left":
                    onPage = onPage > 0 ? --onPage : pages.length - 1;
                    if (onPage === 0) {
                        queueSendRow.components[0].disabled = true;
                        queueSendRow.components[1].disabled = true;
                        queueSendRow.components[2].disabled = false;
                        queueSendRow.components[3].disabled = false;
                    } else {
                        queueSendRow.components[2].disabled = false;
                        queueSendRow.components[3].disabled = false; // optional
                    }
                    embed.setDescription(`**Queued Tracks**\n\n${pages[onPage]}`)
                    .setFooter(`Page ${onPage + 1}/${pagesLen}`);
                    await interaction.editParent({ embeds: [embed], components: [queueSendRow] });
                    break;

                case "right":
                    onPage = onPage + 1 < pages.length ? ++onPage : 0;
                    if (onPage === (pages.length - 1)) {
                        queueSendRow.components[0].disabled = false;
                        queueSendRow.components[1].disabled = false;
                        queueSendRow.components[2].disabled = true;
                        queueSendRow.components[3].disabled = true;
                    } else {
                        queueSendRow.components[0].disabled = false;
                        queueSendRow.components[1].disabled = false; // optional
                    }
                    embed.setDescription(`**Queued Tracks**\n\n${pages[onPage]}`)
                    .setFooter(`Page ${onPage + 1}/${pagesLen}`);
                    await interaction.editParent({ embeds: [embed], components: [queueSendRow] });
                    break;

                case "jmp_end":
                    onPage = pagesLen - 1;
                    queueSendRow.components[0].disabled = false;
                    queueSendRow.components[1].disabled = false;
                    queueSendRow.components[2].disabled = true;
                    queueSendRow.components[3].disabled = true;
                    embed.setDescription(`**Queued Tracks**\n\n${pages[onPage]}`)
                    .setFooter(`Page ${pagesLen}/${pagesLen}`);
                    await interaction.editParent({ embeds: [embed], components: [queueSendRow] });
                    break;

                case "delete_msg":
                    collector.removeListener("collect", () => { });
                    await cachedMsg.delete();
                    break;

                default:
                    Logger.warn("Warn: Queue collector emitted non-existent custom id.");
                    break;
            }
        });
    },
});
