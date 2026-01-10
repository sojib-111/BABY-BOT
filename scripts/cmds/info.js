const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "info",
    version: "2.0",
    author: "Tarek",
    shortDescription: "Display bot and owner information",
    longDescription: "Shows detailed info including bot name, prefix, and owner's personal information.",
    category: "Special",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const id = event.senderID;
    const userData = await usersData.get(id);
    const name = userData.name;
    const mention = [{ id, tag: name }];

    // 🛠 Convert Google Drive view link to direct download link
    const fileId = "1QQ4rcb5mnLytHKuavPxOjx0rF-YuOTaS";
    const directURL = `https://files.catbox.moe/5osi10.mp4`;

    // ⏬ Download the file temporarily
    const filePath = path.join(__dirname, "owner-video.mp4");
    const response = await axios({
      url: directURL,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    const info = 
`━━━━━━━━━━━━━━━━
👋 𝗛𝗲𝗹𝗹𝗼, ${name}

📌 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
• 𝗡𝗮𝗺𝗲➝ 🎀✨[𝗦𝗢𝗝𝗜𝗕-𝗕𝗢𝗧]❤️‍🩹🪼🍷
• 𝗣𝗿𝗲𝗳𝗶𝘅 ➝*

╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       : 𝗦𝗢𝗝𝗜𝗕 𝗜𝗦𝗟𝗔𝗠
│ 🧸 Nɪᴄᴋ       : 𝗦𝗢𝗝𝗜𝗕
│ 🎂 Aɢᴇ        : 17
│ 💘 Rᴇʟᴀᴛɪᴏɴ : Sɪɴɢʟᴇ
│ 🎓 Pʀᴏғᴇssɪᴏɴ : Sᴛᴜᴅᴇɴᴛ
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : 𝗦𝗦𝗖 26
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : 𝗥𝗮𝗻𝗴𝗽𝘂𝗿-𝗹𝗮𝗹𝗺𝗼𝗻𝗶𝗿𝗵𝗮𝘁
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook  : Vortex L. Flix Il 
│ 💬 Messenger:.. 
│ 📞 WhatsApp  : wa.me/0130****777
╰────────────────╯`;

    message.reply({
      body: info,
      mentions: mention,
      attachment: fs.createReadStream(filePath)
    });
  }
};
