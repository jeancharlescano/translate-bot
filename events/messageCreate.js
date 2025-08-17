import { translate } from "../utils/translate.js";
import getTimestamp from "../utils/date.js";
import { Events } from "discord.js";
import { pool } from "../config/database.config.js";

export default {
  name: Events.MessageCreate,
  async execute(message, client ) {

    const serverData = await pool.query(`SELECT * FROM config WHERE server_id = $1`, [message.guildId])
    console.log("🚀 ~ execute ~ serverData:", serverData.rows)
    const announceId = "1220073639987249174";
    const patchesId = "1220073409971621948";
    const debugId = "1032291594000416840"
    console.log(
      `[${getTimestamp()}] ✉️ Message reçu dans ${message.channelId} par ${message.author.tag} (id : ${message.author.id}) (webhookId: ${message.webhookId}) \n ${message.content}`
    );
    console.log(serverData.rows[0].channel_id)
    // TODO Verifier finir ce if 
    // if (serverData.rows[0].channel_id  message.channelId ) {
    //   console.warn(`[${getTimestamp()}] 🚧 Message ailleurs que dans les channels prévus`);
    //   return;
    // }

    // const msgTranslated = await translate(message.content);
    // const channel = client.channels.cache.get(message.channelId);

    // if (channel) {
    //   const messageParts = splitMessage(msgTranslated);

    //   try {
    //     for (let i = 0; i < messageParts.length; i++) {
    //       const content = messageParts[i];

    //       await channel.send(content);
    //       console.log(`[${getTimestamp()}] 📤 Sent message part ${i + 1}/${messageParts.length}: ${content.substring(0, 100)}...`);

    //       // Petite pause entre les messages pour éviter le rate limiting
    //       if (i < messageParts.length - 1) {
    //         await new Promise(resolve => setTimeout(resolve, 100));
    //       }
    //     }
    //   } catch (err) {
    //     console.log(`[${getTimestamp()}] 🚀 ~ err:`, err);
    //   }
    // }
  }
};

function splitMessage(content, maxLength = 2000) {
  const prefix = "|| <@&1219613611077533857> || \n ";
  const availableLength = maxLength - prefix.length;

  if (content.length <= availableLength) {
    return [content];
  }

  const messages = [];
  let remaining = content;

  while (remaining.length > availableLength) {
    let splitPoint = availableLength;

    // Chercher le dernier point ou saut de ligne avant la limite
    const lastPeriod = remaining.lastIndexOf('.', splitPoint);
    const lastNewline = remaining.lastIndexOf('\n', splitPoint);
    const lastExclamation = remaining.lastIndexOf('!', splitPoint);
    const lastQuestion = remaining.lastIndexOf('?', splitPoint);

    // Prendre le point de coupure le plus proche de la fin
    const cutPoints = [lastPeriod, lastNewline, lastExclamation, lastQuestion]
      .filter(point => point > splitPoint * 0.5); // Au moins à la moitié pour éviter des messages trop courts

    if (cutPoints.length > 0) {
      splitPoint = Math.max(...cutPoints) + 1; // +1 pour inclure le caractère de ponctuation
    } else {
      // Si aucun point de coupure naturel, chercher le dernier espace
      const lastSpace = remaining.lastIndexOf(' ', splitPoint);
      if (lastSpace > splitPoint * 0.5) {
        splitPoint = lastSpace;
      }
    }

    messages.push(remaining.substring(0, splitPoint).trim());
    remaining = remaining.substring(splitPoint).trim();
  }

  // Ajouter le reste s'il y en a
  if (remaining.length > 0) {
    messages.push(remaining);
  }

  return messages;
}