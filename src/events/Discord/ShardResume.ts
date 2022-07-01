import Event from "@gateway_event";
import Logger from "@logger";

export default new Event("shardResume", (id: number) => {
    Logger.info(`Shard #${id} has been resumed`);
});
