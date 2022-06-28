import { type ActionRowComponents, Constants } from "eris";

const pauseSendComponents: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Resume",
        custom_id: "pause",
        disabled: false,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Skip",
        custom_id: "skip",
        disabled: true,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Stop",
        custom_id: "stop",
        disabled: false,
    },
];

export default pauseSendComponents;
