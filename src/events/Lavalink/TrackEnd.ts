import type { Player } from "vulkava";
import ruqa from "@root";
import PlayerEvent from "@player_event";
import wrapTryCatchError from "@funcs/wrapTryCatch";

export default new PlayerEvent("trackEnd", async (player: Player) => {
    if (!player.queue?.length) {
        await wrapTryCatchError<void>(ruqa.cachedTrackStartMsg.delete());
        player?.destroy();
    } else {
        await wrapTryCatchError<void>(ruqa.cachedTrackStartMsg.delete());
    }
});
