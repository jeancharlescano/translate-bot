import { Client, Events, GatewayIntentBits } from "discord.js";
import onMessageCreate from "./events/messageCreate.js";
import dotenv from "dotenv";
import getTimestamp from "./utils/date.js";

dotenv.config();
// https://discordjs.guide/popular-topics/intents.html#the-intents-bitfield
// https://discord.com/developers/docs/topics/gateway#list-of-intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`[${getTimestamp()}] 🟩 Ready! Logged in as ${readyClient.user.tag}`);
});
client.on("messageCreate", (message) => onMessageCreate(client, message));

client.login(process.env.TOKEN);
