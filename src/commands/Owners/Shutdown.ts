import { exit } from "node:process";
import type { Message } from "eris";
import Command from "@command";

export default new Command({
    name: "shutdown",
    aliases: [],
    description: "Shutdown the bot",
    category: "Owner",
    requirements: ["none"],
    permissions: ["none"],

    run: async ({ message }: {
        message: Message,
    }) => {
        if (message.author.id !== "757925432934006807") {
            return;
        }
        await message.channel.createMessage({ content: "Done!" });
        exit(1);
    },
});
