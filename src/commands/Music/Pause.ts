import { type Client, type Message } from "eris";
import checkIfActive from "@funcs/checkIfActive";
import Command from "@command";
import wrapTryCatchError from "@funcs/wrapTryCatch";
import emojis from "@config/emojis.json";
import pauseResumeSendRow from "@components/PauseResumeState";
import nowplayingSendRow from "@components/NowplayingState";

export default new Command({
    name: "pause",
    aliases: ["wait"],
    description: "Pause the player",
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
        if (player.paused) {
            if (ruqa.cachedTrackStartMsg) {
                (pauseResumeSendRow.components[0] as { label: string }).label = "Pause";
                pauseResumeSendRow.components[1].disabled = false;
                await ruqa.cachedTrackStartMsg.edit({ components: [pauseResumeSendRow] });
            }
            if (ruqa.cachedNowplayingMsg) {
                (nowplayingSendRow.components[0] as { label: string }).label = "Pause";
                nowplayingSendRow.components[1].disabled = false;
            }
            ruqa.usedCommandPause = false;
            player.pause(false);
        } else {
            if (ruqa.cachedTrackStartMsg) {
                (pauseResumeSendRow.components[0] as { label: string }).label = "Resume";
                pauseResumeSendRow.components[1].disabled = true;
                await ruqa.cachedTrackStartMsg.edit({ components: [pauseResumeSendRow] });
            }
            if (ruqa.cachedNowplayingMsg) {
                (nowplayingSendRow.components[0] as { label: string }).label = "Resume";
                nowplayingSendRow.components[1].disabled = true;
                await ruqa.cachedNowplayingMsg.edit({ components: [nowplayingSendRow] });
            }
            ruqa.usedCommandPause = true;
            player.pause(true);
        }
        await wrapTryCatchError<void>(message.addReaction(emojis.ok));
    },
});
