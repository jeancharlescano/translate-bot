import pkg from 'crypto-js';
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import getTimestamp from "../../utils/date.js";
import { validateSourceLanguage, validateTargetLanguage, getSupportedLanguages } from "../../helper/validateLangage.js";
import { pool } from "../../config/database.config.js";
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
        )        .addStringOption(option =>
            option.setName("deepl_api_key")
                .setDescription("Your DeepL API Key (optional - leave empty to use Reverso)")
                .setRequired(false)
        ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        console.log("🚀 ~ execute ~ interaction.guild.id:", interaction.guild.id)
        const channelsId = interaction.options.getString("channels_id").split(",").map(id => id.trim());

        // Validate channel IDs
        if (!channelsId.every(id => /^\d+$/.test(id))) {
            return interaction.reply({ content: "❌ Invalid channel ID format. Please provide a comma-separated list of valid channel IDs.", ephemeral: true })
        }

        // Validate source language format
        const originalLang = interaction.options.getString("original_lang");
        if (!validateSourceLanguage(originalLang)) {
            const supportedLangs = getSupportedLanguages();
            return interaction.reply({ 
                content: `❌ Invalid original language. Please provide a valid language code.\n\n**DeepL codes:** ${supportedLangs.deepl.slice(0, 10).join(', ')}...\n**Reverso languages:** ${supportedLangs.reverso.slice(0, 10).join(', ')}...`, 
                ephemeral: true 
            })
        }
        
        // Validate target language format
        const translatedLang = interaction.options.getString("translated_lang");
        if (!validateTargetLanguage(translatedLang)) {
            const supportedLangs = getSupportedLanguages();
            return interaction.reply({ 
                content: `❌ Invalid target language. Please provide a valid language code.\n\n**DeepL codes:** ${supportedLangs.deepl.slice(0, 10).join(', ')}...\n**Reverso languages:** ${supportedLangs.reverso.slice(0, 10).join(', ')}...`, 
                ephemeral: true 
            })
        }

        // Handle DeepL API key (optional)
        const deeplApiKey = interaction.options.getString("deepl_api_key");
        let encrypted = null;
        
        if (deeplApiKey && deeplApiKey.trim() !== '') {
            // Encrypt DeepL API key if provided
            encrypted = AES.encrypt(deeplApiKey, process.env.PASSPHRASE).toString();
        }

        try {
            await pool.query("INSERT INTO config (server_id, channel_id, source_lang, target_lang, api_key) VALUES($1, $2, $3, $4, $5) ON CONFLICT (server_id) DO UPDATE SET channel_id = $2, source_lang = $3, target_lang = $4, api_key = $5",
                [interaction.guild.id, JSON.stringify(channelsId), originalLang, translatedLang, encrypted]
            )
            
            const serviceUsed = encrypted ? "DeepL" : "Reverso";
            console.log(`[${getTimestamp()}] ✅ Configuration sauvegardée pour le serveur ${interaction.guild.id} avec ${serviceUsed}`)
            await interaction.reply({
                content: `✅ Configuration sauvegardée avec succès !\n\n**Service de traduction:** ${serviceUsed}\n**Langue source:** ${originalLang}\n**Langue cible:** ${translatedLang}`, 
                ephemeral: true
            })

        } catch (error) {
            console.error(`[${getTimestamp()}] ❌ Error saving configuration: ${error.message}`)
            return interaction.reply({ content: "❌ An error occured whiles saving the configuration. Please try again later.", ephemeral: true })
        }
    }
}

