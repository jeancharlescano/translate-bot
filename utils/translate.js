import * as deepl from "deepl-node";
import Reverso from "reverso-api";
import dotenv from "dotenv";
import getTimestamp from "./date.js";
import pkg from 'crypto-js';
const { AES, enc } = pkg;

dotenv.config();

// Mapping des codes de langue DeepL vers les noms de langue Reverso
const DEEPL_TO_REVERSO_LANG = {
  "AR": "arabic",
  "BG": "bulgarian",
  "CS": "czech",
  "DA": "danish",
  "DE": "german",
  "EL": "greek",
  "EN": "english",
  "EN-GB": "english",
  "EN-US": "english",
  "ES": "spanish",
  "ES-419": "spanish",
  "ET": "estonian",
  "FI": "finnish",
  "FR": "french",
  "HE": "hebrew",
  "HU": "hungarian",
  "ID": "indonesian",
  "IT": "italian",
  "JA": "japanese",
  "KO": "korean",
  "LT": "lithuanian",
  "LV": "latvian",
  "NB": "norwegian",
  "NL": "dutch",
  "PL": "polish",
  "PT": "portuguese",
  "PT-BR": "portuguese",
  "PT-PT": "portuguese",
  "RO": "romanian",
  "RU": "russian",
  "SK": "slovak",
  "SL": "slovenian",
  "SV": "swedish",
  "TH": "thai",
  "TR": "turkish",
  "UK": "ukrainian",
  "VI": "vietnamese",
  "ZH": "chinese",
  "ZH-HANS": "chinese",
  "ZH-HANT": "chinese"
};

export const translate = async (msg, original_lang, translated_lang, deeplApiKey) => {
  // Si pas de clé API DeepL, utiliser Reverso
  if (!deeplApiKey || deeplApiKey.trim() === '') {
    return await translateWithReverso(msg, original_lang, translated_lang);
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

export const translateWithReverso = async (msg, original_lang, translated_lang) => {
  try {
    const reverso = new Reverso();

    // Convertir les codes de langue DeepL en noms de langue Reverso
    const sourceLang = DEEPL_TO_REVERSO_LANG[original_lang.toUpperCase()] || original_lang.toLowerCase();
    const targetLang = DEEPL_TO_REVERSO_LANG[translated_lang.toUpperCase()] || translated_lang.toLowerCase();

    console.log(`[${getTimestamp()}] 🔄 Traduction avec Reverso: ${sourceLang} -> ${targetLang}`);
    console.log(`[${getTimestamp()}] 📝 Message à traduire: "${msg}"`);

    // Utiliser la syntaxe Promise (sans callback)
    const result = await reverso.getTranslation(msg, sourceLang, targetLang);

    console.log(`[${getTimestamp()}] 🔍 Réponse Reverso:`, JSON.stringify(result, null, 2));

    // Récupérer le premier élément du tableau translations
    if (result && result.translations && Array.isArray(result.translations) && result.translations.length > 0) {
      const translatedText = result.translations[0];
      console.log(`[${getTimestamp()}] 🌐 message traduit avec Reverso : \n ${translatedText}`);
      return translatedText;
    } else {
      throw new Error("Aucune traduction trouvée dans le tableau translations");
    }

  } catch (error) {
    console.error(`[${getTimestamp()}] ❌ Erreur lors de la traduction avec Reverso:`, error.message);
    console.error(`[${getTimestamp()}] ❌ Stack trace:`, error.stack);
    throw new Error(`Erreur de traduction Reverso: ${error.message}`);
  }
};
