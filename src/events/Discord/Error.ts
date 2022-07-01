import Event from "@gateway_event";
import Logger from "@logger";

export default new Event("error", (error: Error, id: number | undefined) => {
    Logger.error(`ID: ${id ?? "none"}\nError Message: ${error.message}`);
});
