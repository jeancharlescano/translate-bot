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
  let channel;

  if (message.author.bot) {
    return;
  }

  if (message.channelId !== patchesId && message.channelId !== announceId) {
    return;
  }

  const msgTranslated = await translate(message.content);

  message.channelId === announceId
    ? (channel = client.channels.cache.get(announceId))
    : (channel = client.channels.cache.get(patchesId));

  if (channel) {
    await channel
      .send(msgTranslated)
      .then((message) => console.log(`Sent message: ${message.content}`))
      .catch(console.error);
    // await message
    //   .reply(message.content)
    //   .then((message) => console.log(`Sent message: ${message.content}`))
    //   .catch(console.error);
    return;
  }
  return;
});

const translate = async (msg) => {
  const result = await translator.translateText(msg, "en", "fr");
  console.log(result.text);
  return result.text;
};

client.login(token);
