import { SlashCommandBuilder } from "discord.js";
import getTimestamp from "../../utils/date.js";
export const command = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configure the bot settings.")
        .addStringOption(option =>
            option.setName("channels_id")
                .setDescription("Channels where the bot listens and translates; comma-separated list of channel IDs.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("original_lang")
                .setDescription("Language of the original text (e.g., 'fr', 'en')")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("translated_lang")
                .setDescription("Language to translate the text into (e.g., 'en', 'fr')")
                .setRequired(true)
        ).addStringOption(option =>
            option.setName("deepl_api_key")
                .setDescription("Your DeepL API Key")
                .setRequired(true)
        ),

    async execute(interaction) {
        const channelsId = interaction.options.getString("channels_id").split(",").map(id => id.trim());
        const originalLang = interaction.options.getString("original_lang");
        const translatedLang = interaction.options.getString("translated_lang");
        const deeplApiKey = interaction.options.getString("deepl_api_key");
        console.log(`[${getTimestamp()}] 🧮 données reçu :\n channelsId : ${JSON.stringify(channelsId)} \n originalLang : ${originalLang}\n translatedLang : ${translatedLang}\n deeplApiKey : ${deeplApiKey}`);

        await interaction.reply("Commande reçu ")
    }
} 
