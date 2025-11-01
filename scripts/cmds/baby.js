‎const axios = require("axios");
‎
‎const baseApiUrl = async () => "https://www.noobs-api.rf.gd/dipto/baby";
‎
‎module.exports.config = {
‎    name: "bby",
‎    aliases: ["baby", "bbe", "babe"],
‎    version: "7.0.0",
‎    author: "dipto + Maya Optimized 😎",
‎    countDown: 0,
‎    role: 0,
‎    description: "Better than sim simi — optimized ❤️",
‎    category: "chat",
‎    guide: {
‎        en: "{pn} [message]\nteach [msg] - [reply1, reply2]\nremove [msg]\nrm [msg] - [index]\nmsg [msg]\nlist / list all\nedit [msg] - [new]"
‎    }
‎};
‎
‎const send = (api, thread, msg, replyID) => api.sendMessage(msg, thread, replyID);
‎
‎async function request(url) {
‎    try { 
‎        return (await axios.get(url)).data; 
‎    } catch { 
‎        return { message: "⚠️ Server busy, try again" }; 
‎    }
‎}
‎
‎module.exports.onStart = async ({ api, event, args, usersData }) => {
‎    const input = args.join(" ").toLowerCase();
‎    const uid = event.senderID;
‎    const link = await baseApiUrl();
‎
‎    if (!args[0])
‎        return send(api, event.threadID, 
‎            ["Bolo baby 💗", "Hmm? 👀", "Type help baby 🙈", "Try: !baby hi ✨"]
‎            [Math.floor(Math.random()*4)], event.messageID);
‎
‎    // remove msg
‎    if (args[0] === "remove") {
‎        const key = input.replace("remove ", "");
‎        const res = await request(`${link}?remove=${key}&senderID=${uid}`);
‎        return send(api, event.threadID, res.message, event.messageID);
‎    }
‎
‎    // remove index
‎    if (args[0] === "rm" && input.includes("-")) {
‎        const [msg, index] = input.replace("rm ", "").split(" - ");
‎        const res = await request(`${link}?remove=${msg}&index=${index}`);
‎        return send(api, event.threadID, res.message, event.messageID);
‎    }
‎
‎    // teacher list
‎    if (args[0] === "list") {
‎        const all = args[1] === "all";
‎        const data = await request(`${link}?list=all`);
‎
‎        if (!all) return send(api, event.threadID, `Total Teach = ${data.length}`, event.messageID);
‎
‎        const teachers = await Promise.all(
‎            data.teacher.teacherList.map(async (i) => {
‎                const id = Object.keys(i)[0];
‎                const name = (await usersData.get(id)).name;
‎                return { name, count: i[id] };
‎            })
‎        );
‎
‎        teachers.sort((a, b) => b.count - a.count);
‎        const list = teachers.map((t, x) => `${x + 1}/ ${t.name}: ${t.count}`).join("\n");
‎
‎        return send(api, event.threadID, `👑 Teachers: \n${list}`, event.messageID);
‎    }
‎
‎    // show replies list
‎    if (args[0] === "msg") {
‎        const key = input.replace("msg ", "");
‎        const res = await request(`${link}?list=${key}`);
‎        return send(api, event.threadID, `Message "${key}": ${res?.data}`, event.messageID);
‎    }
‎
‎    // edit reply
‎    if (args[0] === "edit") {
‎        const [oldMsg, newMsg] = input.replace("edit ", "").split(" - ");
‎        if (!newMsg) return send(api, event.threadID, "❌ Format: edit old - new", event.messageID);
‎
‎        const res = await request(`${link}?edit=${oldMsg}&replace=${newMsg}&senderID=${uid}`);
‎        return send(api, event.threadID, `✅ Updated: ${res.message}`, event.messageID);
‎    }
‎
‎    // teach replies
‎    if (args[0] === "teach") {
‎        let [command, reply] = input.split(" - ");
‎        const msg = command.replace("teach ", "");
‎
‎        if (!reply) return send(api, event.threadID, "❌ Format: teach question - reply", event.messageID);
‎
‎        let url = `${link}?teach=${msg}&reply=${reply}&senderID=${uid}`;
‎
‎        if (args[1] === "react") url = `${link}?teach=${msg}&react=${reply}`;
‎        if (args[1] === "amar") url += "&key=intro";
‎
‎        const res = await request(url);
‎
‎        return send(api, event.threadID, `✅ Added reply\n${res.message}`, event.messageID);
‎    }
‎
‎    // name question
‎    if (["amar name ki", "amr nam ki", "whats my name"].some(p => input.includes(p))) {
‎        const res = await request(`${link}?text=amar name ki&senderID=${uid}&key=intro`);
‎        return send(api, event.threadID, res.reply, event.messageID);
‎    }
‎
‎    // default chat AI
‎    const res = await request(`${link}?text=${encodeURIComponent(input)}&senderID=${uid}&font=1`);
‎
‎    api.sendMessage(res.reply, event.threadID, (_, info) => {
‎        global.GoatBot.onReply.set(info.messageID, {
‎            commandName: module.exports.config.name,
‎            type: "reply",
‎            author: uid
‎        });
‎    }, event.messageID);
‎};
‎
‎module.exports.onReply = async ({ api, event }) => {
‎    const text = encodeURIComponent(event.body?.toLowerCase());
‎    const uid = event.senderID;
‎    const link = await baseApiUrl();
‎
‎    const res = await request(`${link}?text=${text}&senderID=${uid}&font=1`);
‎
‎    api.sendMessage(res.reply, event.threadID, (_, info) => {
‎        global.GoatBot.onReply.set(info.messageID, {
‎            commandName: module.exports.config.name,
‎            type: "reply",
‎            author: uid
‎        });
‎    }, event.messageID);
‎};
‎
‎module.exports.onChat = async ({ api, event, usersData }) => {
‎    const body = event.body?.toLowerCase() || "";
‎    const uid = event.senderID;
‎
‎    const triggers = ["baby", "bby", "bot", "jan", "babu", "janu"];
‎    if (!triggers.some(w => body.startsWith(w))) return;
‎
‎    const name = (await usersData.get(uid)).name || "প্রিয়";
‎    const msg = body.replace(/^\S+\s*/, "");
‎
‎    const preset = [
‎        `Can I help you? 😒🌷`,
‎        `আমাকে না ডেকে আমার বস সজিব কে ডাক 😇🫦`,
‎        `আমি ব্যস্ত আছি 🙈`,
‎        `তুমি কি WiFi নাকি? দেখলেই connect 😌`,
‎        `এখন mood off 💗`,
‎        `তুমি নাকি আমার boss 𝗦𝗢𝗝𝗜𝗕 এর বউ 😥`
‎    ];
‎
‎    if (!msg)
‎        return send(api, event.threadID, `✨ ${name} ✨\n\n${preset[Math.random()*preset.length|0]}`, event.messageID);
‎
‎    const res = await request(`${await baseApiUrl()}?text=${encodeURIComponent(msg)}&senderID=${uid}&font=1`);
‎    api.sendMessage(res.reply, event.threadID, event.messageID);
‎};
