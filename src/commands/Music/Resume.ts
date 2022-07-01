import { type Client, type Message } from "eris";
import Command from "@command";
import checkIfActive from "@funcs/checkIfActive";
import createEmbedPost from "@funcs/createEmbedPost";
import wrapTryCatchError from "@funcs/wrapTryCatch";
import emojis from "@config/emojis.json";
import pauseResumeSendRow from "@components/PauseResumeState";
import nowplayingSendRow from "@components/NowplayingState";

export default new Command({
    name: "resume",
    aliases: ["re"],
    description: "Resume the paused playback",
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
            (pauseResumeSendRow.components[0] as { label: string }).label = "Pause";
            pauseResumeSendRow.components[1].disabled = false;
            if (ruqa.cachedTrackStartMsg) {
                await ruqa.cachedTrackStartMsg.edit({ components: [pauseResumeSendRow] });
            }
            if (ruqa.cachedNowplayingMsg) {
                await ruqa.cachedNowplayingMsg.edit({ components: [nowplayingSendRow] });
            }
            ruqa.usedCommandPause = false;
            player.pause(false);
            await wrapTryCatchError<void>(message.addReaction(emojis.ok));
        }
    },
});
