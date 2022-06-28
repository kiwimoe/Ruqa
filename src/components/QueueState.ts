import { type ActionRowComponents, type ActionRow, Constants } from "eris";

const queueSendComponents: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Jump first",
        custom_id: "jmp_first",
        disabled: true,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Previous",
        custom_id: "left",
        disabled: true,
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Next",
        custom_id: "right",
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Jump end",
        custom_id: "jmp_end",
    },
    {
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        label: "Delete",
        custom_id: "delete_msg",
    },
];

const queueSendRow: ActionRow = {
    type: Constants.ComponentTypes.ACTION_ROW,
    components: queueSendComponents,
};

export default queueSendRow;
