import { readdir } from "node:fs/promises";

export default async (dirPath: string): Promise<string> => {
    const dir = (await readdir(dirPath, { withFileTypes: true })).map((x) => x.name.toLowerCase()).join(", ");
    return dir;
};
