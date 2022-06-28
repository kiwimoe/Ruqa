const barSize = 11;
const barText = "▬";
const barSlider = "🔘";

export default function createProgressBar(
    total?: number,
    current?: number,
    url?: string,
): [string, number] {
    const percentage = current! > total! ? 1 : current! / total!;
    const progress = Math.round(barSize * percentage);
    const emptyProgress = barSize - progress;
    const emptyProgressText = barText.repeat(emptyProgress);
    const progressText = progress >= 1 ? `[${barText.repeat(progress)}](${url ?? "unavailable"})${barSlider}` : barSlider;
    const bar = `${progressText}${emptyProgressText}`;
    const calculated = percentage * 100;
    return [bar, calculated];
}
