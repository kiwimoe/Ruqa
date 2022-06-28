import { type ActionRow, type ActionRowComponents, Constants } from "eris";

const nowplayingSendComponents: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Pause",
        custom_id: "np_pause_or_resume",
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Skip",
        custom_id: "np_skip",
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Refresh",
        custom_id: "np_refresh",
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.DANGER,
        label: "Stop",
        custom_id: "np_stop",
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.DANGER,
        label: "Delete",
        custom_id: "np_delete",
    },
];

const nowplayingSendRow: ActionRow = {
    type: Constants.ComponentTypes.ACTION_ROW,
    components: nowplayingSendComponents,
};

export default nowplayingSendRow;
