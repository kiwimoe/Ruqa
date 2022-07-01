import type { Client, Message } from "eris";
import Command from "@command";

export default new Command({
    name: "help",
    aliases: ["h"],
    description: "Sends the help gist",
    category: "Info",
    requirements: ["none"],
    permissions: ["none"],

    run: async ({ ruqa, message }: {
        ruqa: Client,
        message: Message,
    }) => {
        await message.channel.createMessage({ content: `Thanks for using ${ruqa.user.username}! Commands are listed here.\nhttps://gist.github.com/Ruzie/e73bf114b38709c3720f69a98d13ff4c` });
    },
});
