const Jimp = require("jimp");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "slap",
		version: "1.1",
		author: "AYAN Bbe",
		role: 0,
		shortDescription: "Slap someone",
		longDescription: "Slap by mention or reply",
		category: "fun",
		guide: { en: "{pn} @mention / reply" }
	},

	langs: {
		en: {
			noTarget: "Mention someone or reply to a message"
		}
	},

	onStart: async function ({ event, message, getLang }) {
		const uid1 = event.senderID;

		// 🎯 TARGET UID (reply > mention)
		let uid2 = null;

		if (event.messageReply) {
			uid2 = event.messageReply.senderID;
		} else if (Object.keys(event.mentions || {}).length > 0) {
			uid2 = Object.keys(event.mentions)[0];
		}

		if (!uid2) return message.reply(getLang("noTarget"));

		let img1Path, img2Path, outPath;

		try {
			const tmpDir = path.join(__dirname, "tmp");
			await fs.ensureDir(tmpDir);

			img1Path = path.join(tmpDir, `${uid1}.png`);
			img2Path = path.join(tmpDir, `${uid2}.png`);
			outPath  = path.join(tmpDir, `${uid1}_${uid2}_slap.png`);

			const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

			const url1 = `https://graph.facebook.com/${uid1}/picture?width=720&height=720&access_token=${token}`;
			const url2 = `https://graph.facebook.com/${uid2}/picture?width=720&height=720&access_token=${token}`;

			const a1 = await axios.get(url1, { responseType: "arraybuffer" });
			const a2 = await axios.get(url2, { responseType: "arraybuffer" });

			await fs.writeFile(img1Path, a1.data);
			await fs.writeFile(img2Path, a2.data);

			const base = await Jimp.read(
				"https://raw.githubusercontent.com/Arafat-Core/Arafat-Temp/refs/heads/main/batslap.png"
			);
			const av1 = await Jimp.read(img1Path);
			const av2 = await Jimp.read(img2Path);

			av1.circle();
			av2.circle();

			base.resize(1000, 500);
			av1.resize(220, 220);
			av2.resize(200, 200);

			base.composite(av2, 580, 260); // slapped
			base.composite(av1, 350, 70);  // slapper

			await base.writeAsync(outPath);

			message.reply({
				body: "Bópppp 😵‍💫😵",
				attachment: fs.createReadStream(outPath)
			}, () => {
				fs.unlink(img1Path).catch(() => {});
				fs.unlink(img2Path).catch(() => {});
				fs.unlink(outPath).catch(() => {});
			});

		} catch (err) {
			console.error(err);
			message.reply("❌ Slap generate failed");
		}
	}
};
