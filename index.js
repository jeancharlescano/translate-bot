import { Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import * as deepl from "deepl-node";

dotenv.config();
const token = process.env.TOKEN;
const authKey = process.env.APIKEY;
const translator = new deepl.Translator(authKey);

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

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", async (message) => {
  const announceId = "1220073639987249174";
  const patchesId = "1220073409971621948";
  // const debugChannelId = "1032291594000416840";
  let channel;

  console.log(
    `Message reçu dans ${message.channelId} par ${message.author.tag} (id : ${message.author.id}) (webhookId: ${message.webhookId}) \n ${message.content}`
  );

  // On sort si le message ne vient pas d'un webhook
  if (message.webhookId === null) {
    console.warn("🚧 Message interne skip...");
    return;
  }

  //On sort si le message vient d'un autre channel que Tabor:Annonces et Tabor:Patches
  if (
    message.channelId != patchesId &&
    message.channelId != announceId
    // && message.channelId != debugChannelId
  ) {
    console.warn("🚨 Message ailleur quand dans les channel prévu");
    return;
  }

  const msgTranslated = await translate(message.content);

  switch (message.channelId) {
    case announceId:
      channel = client.channels.cache.get(announceId);
      break;
    case patchesId:
      channel = client.channels.cache.get(patchesId);
      break;
    default:
      channel = client.channels.cache.get(debugChannelId);
  }

  if (channel) {
    await channel
      .send(msgTranslated)
      .then((message) => console.log(`📤 Sent message: ${message.content}`))
      .catch(console.error);
    return;
  }
  return;
});

const translate = async (msg) => {
  const result = await translator.translateText(msg, "en", "fr");
  console.log(`🟦⬜🟥 message traduit : \n ${result.text}`);
  return result.text;
};

client.login(token);
