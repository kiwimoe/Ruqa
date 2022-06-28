import type { Node } from "vulkava";
import PlayerEvent from "@player_event";
import Logger from "@logger";

export default new PlayerEvent("nodeResume", (node: Node) => {
    Logger.info(`${node.identifier} resuming the connection`);
});
