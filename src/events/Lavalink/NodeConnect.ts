import type { Node } from "vulkava";
import PlayerEvent from "@player_event";
import Logger from "@logger";

export default new PlayerEvent("nodeConnect", (node: Node) => {
    Logger.ok(`${node.identifier} was been connected`);
});
