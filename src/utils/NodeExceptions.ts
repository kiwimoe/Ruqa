import { stderr } from "node:process";

export default function panic(
    msg: string | unknown,
    type?: string,
): void {
    stderr.write(`Exception error: ${msg}\nType: ${type?.toLowerCase() ?? "unspecified"}`);
}
