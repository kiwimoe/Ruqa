import type { Message } from "eris";
import ms from "ms";
import checkIfActive from "@funcs/checkIfActive";
import createEmbedPost from "@funcs/createEmbedPost";
import Command from "@command";

export default new Command({
    name: "seek",
    aliases: ["sik"],
    description: "Seek a track to a specific time",
    category: "Music",
    example: "seek [1m]",
    requirements: ["insideVC", "sameVC"],
    permissions: ["none"],

    run: async ({ message, args }: {
        message: Message,
        args: string[],
    }) => {
        const [player, ret] = await checkIfActive(message);
        if (!ret) {
            return;
        }

        if (!args[0]) {
            await createEmbedPost(message, "You need to provide a duration to seek.");
            return;
        }

        const duration = ms(args[0]);
        if (!duration || typeof duration === "undefined") {
            await createEmbedPost(message, "You need to specify a valid duration.");
            return;
        }

        if (!player.playing || player.paused) {
            await createEmbedPost(message, "Can't work when I'm not playing anything either paused.");
            return;
        }

        if (duration < 0 || duration > player.current!.duration) {
            await createEmbedPost(message, "Duration range must be lower than the playback time and higher than zero.");
            return;
        }

        player.seek(duration);
        await createEmbedPost(message, `Seeked to ${ms(duration, { long: true })}.`);
    },
});
