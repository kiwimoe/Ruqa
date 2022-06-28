import { type Client, type Message, Constants } from "eris";
import resumeSendComponents from "@components/ResumeState";
import Command from "@command";
import checkIfActive from "@funcs/checkIfActive";
import createEmbedPost from "@funcs/createEmbedPost";
import wrapTryCatchError from "@funcs/wrapTryCatch";
import emojis from "@config/emojis.json";

export default new Command({
    name: "resume",
    aliases: ["resume"],
    description: "Resume any paused playback",
    category: "Music",
    requirements: ["insideVC", "sameVC"],
    permissions: ["reactions"],

    run: async ({ ruqa, message }: {
        ruqa: Client,
        message: Message,
    }) => {
        const [player, has] = await checkIfActive(message);
        if (!has) {
            return;
        }

        if (!player.paused) {
            await createEmbedPost(message, "I'm not paused to resume.");
        } else {
            if (ruqa.cachedTrackStartMsg) {
                await ruqa.cachedTrackStartMsg.edit({
                    components: [
                        {
                            type: Constants.ComponentTypes.ACTION_ROW,
                            components: resumeSendComponents,
                        },
                    ],
                });
            }
            player.pause(false);
        }
        wrapTryCatchError<void>(message.addReaction(emojis.ok));
    },
});
