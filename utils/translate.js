import * as deepl from "deepl-node";
import dotenv from "dotenv";
import getTimestamp from "./date.js";

dotenv.config();
const authKey = process.env.APIKEY;
const translator = new deepl.Translator(authKey);

export const translate = async (msg) => {
  const result = await translator.translateText(msg, "en", "fr");
  console.log(`[${getTimestamp()}] 🟦⬜🟥 message traduit : \n ${result.text}`);
  return result.text;
};
