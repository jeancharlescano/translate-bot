import { Events } from "discord.js";
import getTimestamp from "../utils/date.js"

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[${getTimestamp()}] 🟩 Ready! Logged in as ${client.user.tag}`);
    }
}