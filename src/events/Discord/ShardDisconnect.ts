import Event from "@gateway_event";
import Logger from "@logger";

export default new Event("shardDisconnect", (error: Error | undefined, id: number) => {
    Logger.info(`Shard #${id} has been disconnected, error: ${error ?? "unknown"}`);
});
