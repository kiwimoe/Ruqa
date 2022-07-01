import type { Client, ComponentInteraction, Message } from "eris";
import ComponentCollector from "@collector";
import Command from "@command";
import searchSendRow from "@components/SearchState";
import createEmbedPost from "@funcs/createEmbedPost";
import emojis from "@config/emojis.json";
import wrapTryCatchError from "@funcs/wrapTryCatch";

export default new Command({
    name: "search",
    aliases: ["se"],
    description: "Search for tracks",
    category: "Music",
    requirements: ["insideVC", "sameVC"],
    permissions: ["connect"],

    run: async ({ ruqa, message, args }: {
        ruqa: Client,
        message: Message,
        args: string[],
    }) => {
        const query = args.join(" ");
        if (!query) {
            await createEmbedPost(message, "You need to query a song.");
            return;
        }
        let result: any;

        if (ruqa.cache.see.length === 0) {
            result = await ruqa.audio.search(query as string);
            /* log #add */
            ruqa.cache.add({ q: query, res: result });
        } else {
            ruqa.cache.see.map(async (value) => {
                if (value.q === query) {
                    if (value.res !== undefined) {
                        /* log #get */
                        result = value.res;
                    }
                }
            });
            /**
             * Note: Check if result is null so it will search else will load from cache
             */
            if (!result) {
                result = await ruqa.audio.search(query as string);
                /* log #add */
                ruqa.cache.add({ q: query, res: result });
            }
        }

        for (let i = 0; i < 5; i++) {
            (searchSendRow.components[0] as unknown as { options: { label: string }[] })
            .options[i].label = result.tracks[i].title;
        }
        const msg = await message.channel.createMessage({ content: "Choose a track which you like", components: [searchSendRow] });
        const filter = (i: ComponentInteraction) => (
            i.member!.id === message.author.id
        );
        const collector = new ComponentCollector(ruqa, msg, filter, { time: 0 });

        const workPlayer = async (pos: number): Promise<void> => {
            await wrapTryCatchError<void>(msg.delete());
            const player = ruqa.audio.createPlayer({
                guildId: message.guildID!,
                textChannelId: message.channel.id,
                voiceChannelId: message.member?.voiceState.channelID,
                selfDeaf: true,
            });
            player.connect();

            switch (result?.loadType) {
                case "LOAD_FAILED":
                    await createEmbedPost(message, `${emojis.error} Failed to load the track.`);
                    break;

                case "NO_MATCHES":
                    await createEmbedPost(message, `${emojis.error} No matches found about your query.`);
                    break;

                case "TRACK_LOADED":
                case "SEARCH_RESULT":
                    result.tracks[0].setRequester(message.author);
                    player.queue.push(result.tracks[pos]);
                    if (player.playing || player.queue.length > 1) {
                        await createEmbedPost(message, `${emojis.ok} Added ${result.tracks[pos].title} in the queue`);
                    }
                    break;
            }

            if (!player.playing) {
                await player.play();
            }
        };

        collector.on("collect", async (interaction: ComponentInteraction) => {
            if (interaction.data.custom_id !== "search_results") {
                return;
            }
            switch ((interaction.data as { values: string[] }).values[0]) {
                case "choose_1":
                    await workPlayer(0);
                    break;

                case "choose_2":
                    await workPlayer(1);
                    break;

                case "choose_3":
                    await workPlayer(2);
                    break;

                case "choose_4":
                    await workPlayer(3);
                    break;

                case "choose_5":
                    await workPlayer(4);
                    break;
            }
        });
    },
});
