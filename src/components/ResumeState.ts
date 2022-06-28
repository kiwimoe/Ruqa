import { type ActionRowComponents, Constants } from "eris";

const resumeSendComponents: ActionRowComponents[] = [
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

export default resumeSendComponents;
