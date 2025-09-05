import { REST, Routes } from "discord.js"
import fs from "fs"
import path from "path"
import dotenv from "dotenv";
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import getTimestamp from "./utils/date.js";

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadCommands() {
    const commands = [];

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolder = fs.readdirSync(foldersPath);

    for (const folder of commandFolder) {
        const commandsPath = path.join(foldersPath, folder)
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const { command } = await import(pathToFileURL(filePath).href);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[${getTimestamp()}] 🚨 The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    return commands;
}
const rest = new REST().setToken(process.env.TOKEN);

// Deploy commands to the given discord server
export async function deployCommands(guildId) {
    try {
        const commands = await loadCommands();
        console.log(`[${getTimestamp()}] 🏁 Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENTID, guildId),
            { body: commands },
        );

        console.log(` [${getTimestamp()}] ✔ Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
};

export async function deployAllGuildCommands(client) {
    try {
        const commands = await loadCommands();
        console.log(`[${getTimestamp()}] 🏁 Started refreshing ${commands.length} (/) commands in all guilds.`);

        for (const [guildId] of client.guilds.cache) {
            try {
                const data = await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENTID, guildId),
                    { body: commands },
                );
                console.log(`[${getTimestamp()}] ✔ Reloaded ${data.length} commands in guild ${guildId}`);
            } catch (err) {
                console.error(`[${getTimestamp()}] ❌ Failed to reload commands in guild ${guildId}:`, err);
            }
        }
    } catch (error) {
        console.error(error);
    }
}