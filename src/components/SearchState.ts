import { ActionRow, ActionRowComponents, Constants } from "eris";

const searchSendComponents: ActionRowComponents[] = [
    {
        type: Constants.ComponentTypes.SELECT_MENU,
        custom_id: "search_results",
        placeholder: "Select an option",
        options: [
            {
                label: "",
                value: "choose_1",
                description: "[Insert description here]"
            },
            {
                label: "",
                value: "choose_2",
                description: "This is only here to show off picking one"
            },
            {
                label: "",
                value: "choose_3",
                description: "This is only here to show off picking one"
            },
            {
                label: "",
                value: "choose_4",
                description: "This is only here to show off picking one"
            },
            {
                label: "",
                value: "choose_5",
                description: "This is only here to show off picking one"
            },
        ],
        min_values: 1,
        max_values: 1,
        disabled: false,
    },
];

const searchSendRow: ActionRow = {
    type: Constants.ComponentTypes.ACTION_ROW,
    components: searchSendComponents,
};

export default searchSendRow;
