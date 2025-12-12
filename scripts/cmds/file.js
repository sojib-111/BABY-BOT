const fs = require('fs');

module.exports = {
	config: {
		name: "file",
		aliases: ["files"],
		version: "1.0",
		author: "Mahir Tahsan",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send bot specified file ",
		category: "𝗢𝗪𝗡𝗘𝗥",
		guide: "{pn} file name. Ex: .{pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {
		const permission = ["61579795833614","61582355550594","61580864323213"];
		if (!permission.includes(event.senderID)) {
			return api.sendMessage(""file You Have No Permission! 🚫
This Command is Only For Boss 🅂🄾🄹🄸🄱 (‧_‧?)😘

ছাগল! এই কমান্ডটা তোর জন্য না!
👑 এইটা শুধুমাত্র আমার বস ╰──͜͡⪼🅂🄾🄹🄸🄱 (‧_‧?) 👽 ব্যবহার করতে পারবে!
তুই এডমিন লেভেলে নাই বুঝলি? 😂", event.threadID, event.messageID);
		}

		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("Please provide a file name.", event.threadID, event.messageID);
		}

		const filePath = __dirname + `/${fileName}.js`;
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');
		api.sendMessage({ body: fileContent }, event.threadID);
	}
};
