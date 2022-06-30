import Command from "@command";
import RichEmbed from "@embed";
import ReadDir from "@utils/ReadDir";
import type { Message } from "eris";

export default new Command({
    name: "help",
    aliases: ["h"],
    description: "Shows the help command",
    category: "Info",
    example: "help [command (optional)]",
    requirements: ["none"],
    permissions: ["none"],

    run: async ({ message }: {
        message: Message,
    }) => {
        const embed = new RichEmbed()
        .setColor(RichEmbed.embedColor)
        .setTitle("Commands [under work]")
        .addField("Music Commands", await ReadDir("dist/commands/Music");
        await message.channel.createMessage({ embeds: [embed] });
    },
});
