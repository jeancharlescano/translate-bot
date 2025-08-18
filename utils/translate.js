import * as deepl from "deepl-node";
import dotenv from "dotenv";
import getTimestamp from "./date.js";
import pkg from 'crypto-js';
const { AES, enc } = pkg;

dotenv.config();

export const translate = async (msg, original_lang, translated_lang, deeplApiKey) => {
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

  console.log(`[${getTimestamp()}] 🟦⬜🟥 message traduit : \n ${result.text}`);
  
  return result.text;
};
