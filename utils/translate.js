import * as deepl from "deepl-node";
import dotenv from "dotenv";
import getTimestamp from "./date.js";

dotenv.config();
const authKey = process.env.APIKEY;
const translator = new deepl.Translator(authKey);

export const translate = async (msg, original_lang, translated_lang) => {
  const result = await translator.translateText(msg, original_lang, translated_lang);
  console.log(`[${getTimestamp()}] 🟦⬜🟥 message traduit : \n ${result.text}`);
  return result.text;
};
