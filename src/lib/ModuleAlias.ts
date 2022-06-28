import { resolve } from "node:path";
import moduleAlias from "module-alias";

/**
 * Those I use most (embed, logger, collector) I've set a direct
 * alias for them.
 */
moduleAlias.addAliases({
    "@root": resolve(".", "dist/index"),
    "@embed": resolve(".", "dist/utils/RichEmbed"),
    "@collector": resolve(".", "dist/utils/Collector"),
    "@utils": resolve(".", "dist/utils"),
    "@config": resolve(".", "dist/config"),
    "@logger": resolve(".", "dist/utils/Logger"),
    "@components": resolve(".", "dist/components"),
    "@player_event": resolve(".", "dist/structures/PlayerEvent"),
    "@gateway_event": resolve(".", "dist/structures/GatewayEvent"),
    "@command": resolve(".", "dist/structures/Command"),
    "@funcs": resolve(".", "dist/functions"),
    "@typings": resolve(".", "dist/typings"),
});
