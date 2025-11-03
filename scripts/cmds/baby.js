const axios = require('axios');
const baseApiUrl = async () => "https://www.noobs-api.rf.gd/dipto";

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe"],
    version: "7.0.0",
    author: "dipto + Maya Fix",
    countDown: 0,
    role: 0,
    description: "better than all sim simi",
    category: "chat",
    guide: {
        en: `{pn} hi | {pn} teach message - reply | {pn} list`
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const text = args.join(" ").toLowerCase();
    const uid = event.senderID;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "Hum baby", "type !baby hi", "Hi jaan"];
            return api.sendMessage(ran[Math.floor(Math.random()*ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const key = text.replace("remove ", "");
            const res = (await axios.get(`${link}?remove=${key}&senderID=${uid}`)).data.message;
            return api.sendMessage(res, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && text.includes('-')) {
            const [msg, index] = text.replace("rm ","").split(' - ');
            const res = (await axios.get(`${link}?remove=${msg}&index=${index}`)).data.message;
            return api.sendMessage(res, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            const data = (await axios.get(`${link}?list=all`)).data;
            return api.sendMessage(`Total Teach = ${data.length}`, event.threadID, event.messageID);
        }

        if (args[0] === 'msg') {
            const key = text.replace("msg ", "");
            const res = (await axios.get(`${link}?list=${key}`)).data.data;
            return api.sendMessage(`Message ${key} = ${res}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const [oldText, newText] = text.replace("edit ","").split(" - ");
            const res = (await axios.get(`${link}?edit=${oldText}&replace=${newText}&senderID=${uid}`)).data.message;
            return api.sendMessage(`✅ Updated: ${res}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'react') {
            const [msg, reply] = text.replace("teach ","").split(" - ");
            const res = (await axios.get(`${link}?teach=${msg}&reply=${reply}&senderID=${uid}`)).data;
            const teacher = (await usersData.get(res.teacher)).name;
            return api.sendMessage(`✅ Added: ${res.message}\n👤 Teacher: ${teacher}\n📦 Total: ${res.teachs}`, event.threadID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            const [msg, react] = text.replace("teach react ","").split(" - ");
            const res = (await axios.get(`${link}?teach=${msg}&react=${react}`)).data.message;
            return api.sendMessage(`✅ Reaction Added: ${res}`, event.threadID);
        }

        const ai = (await axios.get(`${link}?text=${encodeURIComponent(text)}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(ai, event.threadID, (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: module.exports.config.name,
                messageID: info.messageID,
                author: uid
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        return api.sendMessage("⚠️ Error! check console", event.threadID);
    }
};

module.exports.onReply = async ({ api, event }) => {
    if (event.type !== "message_reply") return;

    try {
        const text = event.body?.toLowerCase() || "";
        const res = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(text)}&senderID=${event.senderID}&font=1`)).data.reply;

        api.sendMessage(res, event.threadID, (err, info) => {
            global.GoatBot.onReply.set(info.messageID,{
                commandName: module.exports.config.name,
                messageID: info.messageID,
                author: event.senderID
            });
        }, event.messageID);
    } catch (err) {
        return api.sendMessage(`⚠️ Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({ api, event, usersData }) => {
    try {
        const body = event.body?.toLowerCase() || "";
        const uid = event.senderID;
        const name = (await usersData.get(uid)).name || "প্রিয়";

        const rawReplies = [
            "Can I help you 😒🌷",
            "আমাকে না ডেকে SOJIN কে ডাক 😇🫦",
            "আমি বস এর সাথে ব্যস্ত আছি 🙈👀🌊",
            "বেবি তুমি কি WI-FI নাকি দেখলেই কানেক্ট হইয়া যায় 🎀",
            "এখন আমার মন ভালো না পরে কথা বলি 💗☺️",
            "তুমি নাকি আমার বস SOJIB এর বউ 🙈😥",
            "এতো ডাকছিস কেন? গালি শুনবি নাকি? 🤬",
            "ঝাং 🫵 থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦",
            "তোর কথা তোর বাড়ি কেউ শুনে না, তো আমি কেন শুনবো? 🤔😂",
            "ভালোবাসা নামক আব্লামি করতে চাইলে আমার বস সজিন এর ইনবক্স যাও 🙊🥱👅",
            "জান তুমি শুধু আমার 💝",
            "হাজারো লুচ্চি লুচ্চার ভিড়ে আমার বস সজিব সাদা মনের মানুষ 🤗🙆‍♂️",
            "আমাকে না ডেকে আমার বস সজিব কে জি এফ দাও 😽🫶🌺",
            "তুই আমার না তুই কার 😒💘",
            "জান কি করো? আমাকেই মনে পড়লো? 🥰",
            "আমি রাগ করলে Sorry বলবি নাহলে block 😤",
            "বেবি call দাও না 🥺📞",
            "তুমি offline গেলে আমার মুড খারাপ হয় 😔",
            "এত cute কেন তুমি? 😌💗",
            "আর ডাকিস না, লজ্জা লাগে 🙈✨"
        ];

        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
            
            const ask = body.replace(/^\S+\s*/, "");
            const msg = `✨ ${name} ✨\n\n${rawReplies[Math.floor(Math.random()*rawReplies.length)]}`;

            if (!ask) return api.sendMessage(msg, event.threadID);

            const res = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(ask)}&senderID=${uid}`)).data.reply;
            return api.sendMessage(res, event.threadID);
        }
    } catch (err) {}
};
