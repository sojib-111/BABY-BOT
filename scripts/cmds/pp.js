const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pp",
    aliases: ["avatar", "profilepic"],
    version: "1.0",
    author: "Huraira Sajib",
    countDown: 5,
    role: 0,
    category: "info",
    guide: { en: "{pn} or {pn} @mention" }
  },

  onStart: async function ({ message, event }) {
    const { senderID, mentions } = event;
    // যদি কাউকে মেনশন করা হয় তবে তার আইডি, নাহলে যে কমান্ড দিয়েছে তার আইডি
    let uid = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : senderID;

    try {
      // বড় সাইজের প্রোফাইল পিকচার ইউআরএল
      const avatarURL = `https://graph.facebook.com/${uid}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const cachePath = path.join(__dirname, "cache", `${uid}_pp.png`);
      if (!fs.existsSync(path.join(__dirname, "cache"))) fs.mkdirSync(path.join(__dirname, "cache"));

      // ছবি ডাউনলোড করা
      const response = await axios.get(avatarURL, { responseType: 'arraybuffer' });
      fs.writeFileSync(cachePath, Buffer.from(response.data));

      // সরাসরি ছবি পাঠিয়ে দেওয়া
      return message.reply({
        body: `🖼️ 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐭𝐡𝐞 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐏𝐢𝐜𝐭𝐮𝐫𝐞:`,
        attachment: fs.createReadStream(cachePath)
      }, () => {
        if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐭𝐡𝐞 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞!");
    }
  }
};
