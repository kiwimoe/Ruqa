import type { Message } from "eris";

export default async (messageClass: Message, msg: string): Promise<void> => {
    await messageClass.channel.createMessage({ content: msg });
};
