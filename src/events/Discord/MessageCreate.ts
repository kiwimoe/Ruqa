import { env } from "node:process";
import type {
    Message, PossiblyUncachedTextableChannel, TextableChannel, VoiceChannel,
} from "eris";
import ruqa from "@root"
import GatewayEvent from "@gateway_event";
import Logger from "@logger";
import panic from "@utils/NodeExceptions";
import createEmbedPost from "@funcs/createEmbedPost";
import cast from "@funcs/cast";
import isIterable from "@funcs/isIterable";
import type { CommandOptions } from "@typings/CommandOptions";
import type { Tag } from "@typings/Tag";
import type { StackTrace } from "@typings/StackTrace";

export default new GatewayEvent("messageCreate", async (message: Message<PossiblyUncachedTextableChannel>) => {
    if (message.author.bot || !message.guildID || message.webhookID) {
        return;
    }

    const prefix = env.DEFAULT_PREFIX;
    if (!message.content.startsWith(prefix!)) {
        return;
    }
    const args = message.content.split(" ");
    const firstArg = args.shift()?.slice(prefix?.length);
    const cmd = (
        ruqa.commands?.get(firstArg!) ?? ruqa.aliases?.get(firstArg!)
    ) as CommandOptions;

    if (!isIterable(cmd.permissions! || !isIterable(cmd.requirements!))) {
        return;
    }

    for (const req of cmd.requirements!) {
        switch (req) {
            case "insideVC":
                if (!message.member?.voiceState.channelID) {
                    await createEmbedPost(cast<Message<TextableChannel>>(message), "You must need to in a voice channel before using this command.");
                    return;
                }
                break;

            case "sameVC":
                let restMember;
                if (ruqa.cache.see.length === 0) {
                    restMember = await ruqa.getRESTGuildMember(
                        message.guildID!,
                        ruqa.user.id,
                    );
                    /* log #add */
                    ruqa.cache.add({
                        q: message.member?.voiceState.channelID,
                        res: restMember,
                    });
                } else {
                    ruqa.cache.see.map(async (value) => {
                        if (value.q === message.member?.voiceState.channelID) {
                            if (value.res !== undefined) {
                                /** log #get */
                                restMember = value.res;
                            }
                        }
                    });

                    /**
                     * Note: Check if result is null so it will search else will load from cache
                     */
                    if (!restMember) {
                        restMember = await ruqa.getRESTGuildMember(
                            message.guildID!,
                            ruqa.user.id,
                        );
                        /* log #add */
                        ruqa.cache.add({
                            q: message.member?.voiceState.channelID,
                            res: restMember,
                        });
                    }
                }

                if (restMember?.voiceState.channelID) {
                    if (restMember.voiceState.channelID !== message.member?.voiceState.channelID) {
                        await createEmbedPost(
                            cast<Message<TextableChannel>>(message),
                            `You need to join <#${restMember.voiceState.channelID}> channel to use this command.`,
                        );
                        return;
                    }
                }
                break;

            case "none":
                break;

            default:
                throw new TypeError(`Requirement ${req} is invalid.`);
        }
    }

    for (const perm of cmd.permissions!) {
        switch (perm) {
            case "connect":
                if (!cast<VoiceChannel>(ruqa.getChannel(message.member?.voiceState.channelID!)).permissionsOf(ruqa.user.id).has("voiceConnect")) {
                    await createEmbedPost(cast<Message>(message), "I don't have connect permission to execute this command.");
                    return;
                }
                break;

            case "manageGuild":
                if (!cast<VoiceChannel>(ruqa.getChannel(message.member?.voiceState.channelID!)).permissionsOf(ruqa.user.id).has("manageGuild")) {
                    await createEmbedPost(cast<Message>(message), "I don't have manage guild permission to execute this command.");
                    return;
                }
                break;

            case "speak":
                if (!cast<VoiceChannel>(ruqa.getChannel(message.member?.voiceState.channelID!)).permissionsOf(ruqa.user.id).has("voiceSpeak")) {
                    await createEmbedPost(cast<Message>(message), "I don't have speak permission to execute this command.");
                    return;
                }
                break;

            case "reactions":
                if (!cast<VoiceChannel>(ruqa.getChannel(message.member?.voiceState.channelID!)).permissionsOf(ruqa.user.id).has("addReactions")) {
                    await createEmbedPost(cast<Message>(message), "I don't have reactions permission to execute this command.");
                    return;
                }
                break;

            case "none":
                break;

            default:
                throw new TypeError(`Permission ${perm} is invalid.`);
        }
    }

    try {
        (cmd as { run: Function }).run({ ruqa, message, args });
        Logger.info(`${((message.author) as unknown as Tag).tag} used ${cmd.name}`);
    } catch (e) {
        panic((e as StackTrace).stack);
    }
});
