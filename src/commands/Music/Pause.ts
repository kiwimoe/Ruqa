import { type Client, type Message, Constants } from "eris";
import pauseSendComponents from "@components/PauseState";
import resumeSendComponents from "@components/ResumeState";
import checkIfActive from "@funcs/checkIfActive";
import Command from "@command";
import wrapTryCatchError from "@funcs/wrapTryCatch";
import emojis from "@config/emojis.json";

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
        } else {
            if (ruqa.cachedTrackStartMsg) {
                await ruqa.cachedTrackStartMsg.edit({
                    components: [
                        {
                            type: Constants.ComponentTypes.ACTION_ROW,
                            components: pauseSendComponents,
                        },
                    ],
                });
            }
            player.pause(true);
        }
        wrapTryCatchError<void>(message.addReaction(emojis.ok));
    },
});
