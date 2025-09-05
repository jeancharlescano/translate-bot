import * as deepl from "deepl-node";
import dotenv from "dotenv";
import getTimestamp from "./date.js";
import pkg from 'crypto-js';
const { AES, enc } = pkg;

dotenv.config();

// Mapping des codes de langue DeepL vers les codes ISO LibreTranslate
const DEEPL_TO_LIBRE_LANG = {
  "AR": "ar",
  "BG": "bg",
  "CS": "cs",
  "DA": "da",
  "DE": "de",
  "EL": "el",
  "EN": "en",
  "EN-GB": "en",
  "EN-US": "en",
  "ES": "es",
  "ES-419": "es",
  "ET": "et",
  "FI": "fi",
  "FR": "fr",
  "HE": "he",
  "HU": "hu",
  "ID": "id",
  "IT": "it",
  "JA": "ja",
  "KO": "ko",
  "LT": "lt",
  "LV": "lv",
  "NB": "no",
  "NL": "nl",
  "PL": "pl",
  "PT": "pt",
  "PT-BR": "pt",
  "PT-PT": "pt",
  "RO": "ro",
  "RU": "ru",
  "SK": "sk",
  "SL": "sl",
  "SV": "sv",
  "TH": "th",
  "TR": "tr",
  "UK": "uk",
  "VI": "vi",
  "ZH": "zh",
  "ZH-HANS": "zh",
  "ZH-HANT": "zh"
};

export const translate = async (msg, original_lang, translated_lang, deeplApiKey) => {
  // Si pas de clé API DeepL, utiliser LibreTranslate
  if (!deeplApiKey || deeplApiKey.trim() === '') {
    return await translateWithLibreTranslate(msg, original_lang, translated_lang);
  }

  // Sinon, utiliser DeepL comme avant
  if (!process.env.PASSPHRASE) {
    throw new Error("PASSPHRASE manquante dans les variables d'environnement");
  }

  const decrypted = AES.decrypt(deeplApiKey, process.env.PASSPHRASE);
  const apiKey = decrypted.toString(enc.Utf8);

  if (!apiKey) {
    throw new Error("Échec du déchiffrement de la clé API. Vérifiez la PASSPHRASE et la valeur chiffrée.");
  }

  const translator = new deepl.Translator(apiKey);
  const result = await translator.translateText(msg, original_lang, translated_lang);

  console.log(`[${getTimestamp()}] 🟦⬜🟥 message traduit avec DeepL : \n ${result.text}`);

  return result.text;
};

export const translateWithLibreTranslate = async (msg, original_lang, translated_lang) => {
  try {
    const endpoint = 'https://translate.jccano.fr/translate';

    const sourceLang = DEEPL_TO_LIBRE_LANG[original_lang.toUpperCase()] || original_lang.split('-')[0].toLowerCase();
    const targetLang = DEEPL_TO_LIBRE_LANG[translated_lang.toUpperCase()] || translated_lang.split('-')[0].toLowerCase();

    console.log(`[${getTimestamp()}] 🔄 Traduction avec LibreTranslate (jccano.fr): ${sourceLang} -> ${targetLang}`);
    console.log(`[${getTimestamp()}] 📝 Message à traduire: "${msg}"`);

    const body = {
      q: msg,
      source: sourceLang,
      target: targetLang
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`LibreTranslate HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();
    if (data && typeof data.translatedText === 'string') {
      console.log(`[${getTimestamp()}] 🌐 message traduit avec LibreTranslate (jccano.fr) : \n ${data.translatedText}`);
      return data.translatedText;
    }
    throw new Error('Réponse LibreTranslate invalide');
  } catch (error) {
    console.error(`[${getTimestamp()}] ❌ Erreur lors de la traduction avec LibreTranslate:`, error.message);
    console.error(`[${getTimestamp()}] ❌ Stack trace:`, error.stack);
    throw new Error(`Erreur de traduction LibreTranslate: ${error.message}`);
  }
};
