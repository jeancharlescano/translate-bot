import { codeBlock, Events } from "discord.js";
import { bold, italic } from "@discordjs/formatters";
import getTimestamp from "../utils/date.js";
import { deployCommands } from "../deploy-commands.js";

export default {
    name: Events.GuildCreate,
    async execute(guild) {
        console.log(`[${getTimestamp()}] 🛬 Join new discord Server ${guild.name} (${guild.id})`)
        const channel = guild.channels.cache.find(
            ch => ch.type === 0 && ch.permissionsFor(guild.members.me).has("SendMessages")
        );

        if (channel) {
            channel.send(
                `Thanks for adding me on ${bold(guild.name)} ! 🚀

I am a bot that translates messages into the language you want.

${bold("Requirements")}
- Create an account here: https://www.deepl.com/fr/signup
- Get your API key here: https://www.deepl.com/fr/your-account/keys

${bold("Configuration")}
- Param ${italic("channels Id")} : list of channels where the bot will listen and translate messages.
- Param ${italic("original Lang")} : the language of the original message (ex: "en" for English).
- Param ${italic("translated Lang")} : the language of the translation (ex: "fr" for French).
- Param ${italic("deepl Api Key")} : your DeepL API Key.

Please use the command ${codeBlock("/config")}`
            );
        } else {
            console.log(`[${getTimestamp()}] ⚠️ Aucun salon texte trouvé où envoyer le message.`);
        }

        await deployCommands(guild.id)
    }
}