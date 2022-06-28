import { ComponentInteraction, type Interaction } from "eris";
import ruqa from "@root";
import GatewayEvent from "@gateway_event";
import type { CollectFn, MessageID } from "@typings/ComponentPatch";

export default new GatewayEvent("interactionCreate", async (interaction: Interaction) => {
    if (interaction instanceof ComponentInteraction) {
        await interaction.deferUpdate();
        for (const collector of ruqa.componentCollectors) {
            if ((collector as MessageID).message.id === interaction.message.id) {
                (collector as CollectFn).collect(interaction);
                break;
            }
        }
    }
});
