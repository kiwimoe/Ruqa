import type { Node } from "vulkava";
import PlayerEvent from "@player_event";
import Logger from "@logger";

export default new PlayerEvent("nodeDisconnect", (node: Node) => {
    Logger.error(`${node.identifier} was been disconnected`);
});
