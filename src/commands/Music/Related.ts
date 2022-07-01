import type { Client, Message } from "eris";
import Command from "@command";
import RichEmbed from "@embed";
import checkIfActive from "@funcs/checkIfActive";
import createEmbedPost from "@funcs/createEmbedPost";
import wrapTryCatchError from "@funcs/wrapTryCatch";
import emojis from "@config/emojis.json";

export default new Command({
    name: "related",
    aliases: ["matched", "same"],
    description: "Add matched tracks in the queue",
    category: "Music",
    example: "related",
    requirements: ["insideVC", "sameVC"],
    permissions: ["none"],

    run: async ({ ruqa, message }: {
        ruqa: Client,
        message: Message,
    }) => {
        let msg: Message;
        const [player, has] = await checkIfActive(message);
        if (!has) {
            return;
        }

        await wrapTryCatchError<void>(message.addReaction(emojis.flowing_sand));
        const res = await ruqa.audio.search(`https://www.youtube.com/watch?v=${player.current?.identifier}&list=RD${player.current?.identifier}&start_radio=1`);

        if (res.loadType !== "PLAYLIST_LOADED") {
            await createEmbedPost(message, "There are no tracks found.");
            return;
        }

        msg = await message.channel.createMessage({
            embeds: [
                new RichEmbed()
                .setColor(RichEmbed.embedColor)
                .setDescription(`Loading playlist ${res.playlistInfo?.name?.replaceAll("||", "")}`),
            ],
        });

        res.tracks.forEach((each) => {
            each.setRequester(message.author);
            player?.queue.push(each);
        });
        await wrapTryCatchError<void>(message.removeReaction(emojis.flowing_sand));
        await msg.edit({
            embeds: [
                new RichEmbed()
                .setColor(RichEmbed.embedColor)
                .setDescription(`Added ${res.playlistInfo?.name?.replaceAll("||", "")}`),
            ],
        });
    },
});
