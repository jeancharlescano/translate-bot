import { SlashCommandBuilder } from "discord.js";
import getTimestamp from "../../utils/date.js";
import { validateSourceLanguage, validateTargetLanguage } from "../../helper/validateLangage.js";
import { pool } from "../../config/database.config.js";
import pkg from 'crypto-js';
const { AES } = pkg;
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
        console.log("🚀 ~ execute ~ interaction.guild.id:", interaction.guild.id)
        const channelsId = interaction.options.getString("channels_id").split(",").map(id => id.trim());

        // Validate channel IDs
        if (!channelsId.every(id => /^\d+$/.test(id))) {
            return interaction.reply({ content: "Invalid channel ID format. Please provide a comma-separated list of valid channel IDs.", ephemeral: true })
        }

        const originalLang = interaction.options.getString("original_lang");
        if (!validateSourceLanguage(originalLang)) {
            return interaction.replu({ content: "Invalid original language. Please provide a valid language code. Refer to : https://developers.deepl.com/docs/getting-started/supported-languages ", ephemeral: true })
        }

        const translatedLang = interaction.options.getString("translated_lang");
        if (!validateTargetLanguage(translatedLang)) {
            return interaction.replu({ content: "Invalid target language. Please provide a valid language code. Refer to : https://developers.deepl.com/docs/getting-started/supported-languages ", ephemeral: true })
        }
        const deeplApiKey = interaction.options.getString("deepl_api_key");
        // hash the API key for security with hash key and store it in db 
        const encrypted = AES.encrypt(deeplApiKey, process.env.PASSPHRASE).toString();

        try {
            // channel_id en db est de type jsonb
            await pool.query("INSERT INTO config (server_id, channel_id, source_lang, target_lang, api_key) VALUES($1, $2, $3, $4, $5) ON CONFLICT (server_id) DO UPDATE SET channel_id = $2, source_lang = $3, target_lang = $4, api_key = $5",
                [interaction.guild.id, JSON.stringify(channelsId), originalLang, translatedLang, encrypted]
            )
            console.log(`[${getTimestamp()}] ✅ Configuration sauvegardée pour le serveur ${interaction.guild.id}`)
            await interaction.reply("Commande reçu ")

        } catch (error) {
            console.error(`[${getTimestamp()}] ❌ Error saving configuration: ${error.message}`)
            return interaction.reply({ content: "An error occured whiles saving the configuration. Please try again later.", ephemeral: true })
        }
    }
}

