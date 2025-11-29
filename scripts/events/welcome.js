✅ Command executed:
const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.8",
		author: "NTKhang (Modified by Tarek)",
		category: "events"
	},

	langs: {
		en: {
			session1: "𝗺𝗼𝗿𝗻𝗶𝗻𝗴",
			session2: "𝗻𝗼𝗼𝗻",
			session3: "𝗮𝗳𝘁𝗲𝗿𝗻𝗼𝗼𝗻",
			session4: "𝗲𝘃𝗲𝗻𝗶𝗻𝗴",
			welcomeMessage: "😘 𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂 𝗮𝗹𝗮𝗶𝗸𝘂𝗺 😘\n\n 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝗶𝗻𝘃𝗶𝘁𝗶𝗻𝗴 𝗺𝗲 𝘁𝗼 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽!\n 𝗕𝗼𝘁 𝗽𝗿𝗲𝗳𝗶𝘅: %1\n𝗧𝗼 𝘃𝗶𝗲𝘄 𝘁𝗵𝗲 𝗹𝗶𝘀𝘁 𝗼𝗳 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀, 𝗽𝗹𝗲𝗮𝗰𝗲 𝗲𝗻𝘁𝗲𝗿: %1𝗵𝗲𝗹𝗽\n\n♻ 𝗜 𝗵𝗼𝗽𝗲 𝘆𝗼𝘂 𝘄𝗶𝗹𝗹 𝗳𝗼𝗹𝗹𝗼𝘄 𝗼𝘂𝗿 𝗮𝗹𝗹 𝗴𝗿𝗼𝘂𝗽 𝗿𝘂𝗹𝗲𝘀 ♻",
			multiple1: "𝘆𝗼𝘂",
			multiple2: "𝘆𝗼𝘂 𝗴𝘂𝘆𝘀",
			defaultWelcomeMessage: "✨ Hey {userName}! ✨\nWelcome to {boxName} 💐\nHope you’ll have a bright {session} with us 🌈🌸\nMake yourself at home 🏡"
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;

				// যদি Bot অ্যাড হয়
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());

					// bot add হলে video + text
					const video = await drive.getFile("1pY-tr_hKajxwhN9Jzl49hmTIBiZPmC8u", "stream");
					return message.send({
						body: getLang("welcomeMessage", prefix),
						attachment: video
					});
				}

				// অন্য member join হলে
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;

					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [], mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1) multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId)) continue;
						userName.push(user.fullName);
						mentions.push({ tag: user.fullName, id: user.userFbId });
					}
					if (userName.length == 0) return;

					let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
						.replace(/\{session\}/g,
							hours <= 10 ? getLang("session1") :
								hours <= 12 ? getLang("session2") :
									hours <= 18 ? getLang("session3") : getLang("session4")
						);

					form.body = welcomeMessage;

					// এখানে new member এর জন্য আলাদা ভিডিও সেট
					const video = await drive.getFile("1a9ttCB2ghA_S5-7AJvr7xL7NZsg2zPkr", "stream");
					form.attachment = video;

					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
