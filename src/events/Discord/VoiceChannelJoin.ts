import Event from "@gateway_event";
import { AnyVoiceChannel, Member } from "eris";
import ruqa from "@root";
import nowplayingSendRow from "@components/NowplayingState";
import pauseResumeSendRow from "@components/PauseResumeState";

export default new Event("voiceChannelJoin", async (member: Member, channel: AnyVoiceChannel) => {
    const player = ruqa.audio.players.get(member.guild.id);
    if (!player) {
        return;
    }


    if (!member.bot && player.voiceChannelId === channel.id && !ruqa.usedCommandPause) {
        if (!player.paused) {
            return;
        }
        player.pause(false);
        if (ruqa.cachedTrackStartMsg) {
            (pauseResumeSendRow.components[0] as { label: string }).label = "Pause";
            pauseResumeSendRow.components[1].disabled = false;
            await ruqa.cachedTrackStartMsg.edit({ components: [pauseResumeSendRow] });
        }
        if (ruqa.cachedNowplayingMsg) {
            (nowplayingSendRow.components[0] as { label: string }).label = "Pause";
            nowplayingSendRow.components[1].disabled = false;
            await ruqa.cachedNowplayingMsg.edit({ components: [nowplayingSendRow] });
        }
    }
});
