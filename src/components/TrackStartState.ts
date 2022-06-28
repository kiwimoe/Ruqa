import { type ActionRow, type ActionRowComponents, Constants } from "eris";

const trackSendComponents: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Pause",
        custom_id: "pause",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Skip",
        custom_id: "skip",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Stop",
        custom_id: "stop",
        disabled: false,
    },
];

const trackSendRow: ActionRow = {
    type: Constants.ComponentTypes.ACTION_ROW,
    components: trackSendComponents,
};

export default trackSendRow;
