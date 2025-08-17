import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "fs"
import path from 'path';
import dotenv from "dotenv";
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import getTimestamp from "./utils/date.js";

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

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

// Chargement des commandes
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolder = fs.readdirSync(foldersPath)

for (const folder of commandFolder) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { command } = await import(pathToFileURL(filePath).href);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[${getTimestamp()}] 🚨 The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Chargement des events 
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(pathToFileURL(filePath));
    const evt = event.default;

    if (evt.once) {
        client.once(evt.name, (...args) => evt.execute(...args, client));
    } else {
        client.on(evt.name, (...args) => evt.execute(...args, client));
    }
}

client.login(process.env.TOKEN);