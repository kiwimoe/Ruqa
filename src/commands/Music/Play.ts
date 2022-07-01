import type { Client, Message } from "eris";
import type { SearchResult, Track, UnresolvedTrack } from "vulkava";
import Command from "@command";
import createEmbedPost from "@funcs/createEmbedPost";
import emojis from "@config/emojis.json";

export default new Command({
    name: "play",
    aliases: ["p"],
    description: "Play music inside the voice channel",
    category: "Music",
    requirements: ["insideVC", "sameVC"],
    permissions: ["connect", "speak"],

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

            case "PLAYLIST_LOADED":
                result.tracks?.forEach((track: Track | UnresolvedTrack) => {
                    track.setRequester(message.author);
                    player.queue.push(track);
                });
                await createEmbedPost(message, `${emojis.ok} Added ${result.playlistInfo.name} with ${result.tracks.length} track(s) in the queue`);
                break;

            case "TRACK_LOADED":
            case "SEARCH_RESULT":
                result.tracks[0].setRequester(message.author);
                player.queue.push(result.tracks[0]);
                if (player.playing || player.queue.length > 1) {
                    await createEmbedPost(message, `${emojis.ok} Added ${result.tracks[0].title} in the queue`);
                }
                break;
        }

        if (!player.playing) {
            await player.play();
        }
    },
});
