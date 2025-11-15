const axios = require("axios");
const fs = require("fs");
const path = require("path");

const statusFile = path.join(__dirname, "emojiVoice_status.json");

module.exports = {
  config: {
    name: "ae",
    aliases: ["emojiVoice"],
    version: "3.0",
    author: "TAREK",
    countDown: 0,
    role: 0,
    shortDescription: { en: "Emoji to voice" },
    longDescription: { en: "Sends a specific voice from Google Drive when a certain emoji is sent" },
    category: "fun",
    guide: { en: "{p}ae on/off" }
  },

  onStart: async function ({ args, message }) {
    if (!fs.existsSync(statusFile)) {
      fs.writeFileSync(statusFile, JSON.stringify({ enabled: true }, null, 2));
    }

    let status = JSON.parse(fs.readFileSync(statusFile));

    if (args[0] === "on") {
      status.enabled = true;
      fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
      return message.reply("✅ Emoji voice system is now ON");
    }

    if (args[0] === "off") {
      status.enabled = false;
      fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
      return message.reply("❌ Emoji voice system is now OFF");
    }

    return message.reply(`Emoji voice is currently ${status.enabled ? "✅ ON" : "❌ OFF"}`);
  },

  onChat: async function ({ event, api }) {
    if (!fs.existsSync(statusFile)) return;
    let status = JSON.parse(fs.readFileSync(statusFile));
    if (!status.enabled) return;

    const emojiVoices = {
      "🙂": "https://drive.google.com/uc?export=download&id=1rqzq0wCrwZOJPvrP3dv2pVq8-R0w1n5s",
      "🐸": "https://drive.google.com/uc?export=download&id=1sBDdRbD14TbbLVPwwt0C4u8Stcf_i6Tb",
      "😹|🤣|😂|😁": "https://drive.google.com/uc?export=download&id=1sKJ3t174OJyfUljG0NrEUSsInFagiRg-",
      "😦|😧|😮|😯|😟": "https://drive.google.com/uc?export=download&id=1s6-UQ1RDKJ_JCfbBspAl0QHx_zyzDNzP",
      "😒": "https://drive.google.com/uc?export=download&id=1sYsJyfwKNgfGucM-Srvg0wby0J3Ft8xo"
    };

    if (!event.body) return;
    const message = event.body.trim();

    for (let key in emojiVoices) {
      const emojis = key.split("|");
      if (emojis.includes(message)) {
        const voiceUrl = emojiVoices[key];
        const filePath = path.join(__dirname, "emojiVoice.mp3");

        try {
          const response = await axios.get(voiceUrl, { responseType: "arraybuffer" });
          fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

          api.sendMessage(
            { attachment: fs.createReadStream(filePath) },
            event.threadID,
            () => fs.unlinkSync(filePath),
            event.messageID
          );
        } catch (err) {
          console.error(err);
        }
        break;
      }
    }
  }
};
