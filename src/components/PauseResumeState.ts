import { type ActionRowComponents, Constants, ActionRow } from "eris";

const pauseResumeSendComponents: ActionRowComponents[] = [
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

const pauseResumeSendRow: ActionRow = {
    type: Constants.ComponentTypes.ACTION_ROW,
    components: pauseResumeSendComponents,
};

export default pauseResumeSendRow;
