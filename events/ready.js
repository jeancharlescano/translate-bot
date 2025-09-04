import { Events } from "discord.js";
import getTimestamp from "../utils/date.js"
import { deployAllGuildCommands } from "../deploy-commands.js";

export default {
    name: Events.ClientReady,
    once: true,
    async execute (client) {
        console.log(`[${getTimestamp()}] 🟩 Ready! Logged in as ${client.user.tag}`);
        await deployAllGuildCommands(client);
    }
}