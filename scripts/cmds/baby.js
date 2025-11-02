‎const axios = require("axios");
‎
‎const baseApiUrl = async () => "https://www.noobs-api.rf.gd/dipto/baby";
‎
‎module.exports.config = {
‎    name: "bby",
‎    aliases: ["baby", "bbe", "babe"],
‎    version: "7.1.0",
‎    author: "dipto + Maya ❤️",
‎    countDown: 0,
‎    role: 0,
‎    description: "Better than sim simi — ultra optimized 😌",
‎    category: "chat",
‎    guide: {
‎        en: "{pn} [message]\nteach [msg] - [reply1, reply2]\nremove [msg]\nrm [msg] - [index]\nmsg [msg]\nlist / list all\nedit [msg] - [new]"
‎    }
‎};
‎
‎const send = (api, t, m, r) => api.sendMessage(m, t, r);
‎const fetch = async (url) => {
‎    try {
‎        const { data } = await axios.get(url);
‎        return data;
‎    } catch {
‎        return { message: "⚠️ Server Busy / API Offline" };
‎    }
‎};
‎
‎module.exports.onStart = async ({ api, event, args, usersData }) => {
‎    const text = args.join(" ").toLowerCase();
‎    const uid = event.senderID;
‎    const link = await baseApiUrl();
‎
‎    if (!args[0]) {
‎        const replies = ["Bolo baby 💗", "Hmm? 👀", "Type help baby 🙈", "Try: !baby hi ✨"];
‎        return send(api, event.threadID, replies[Math.random() * replies.length | 0], event.messageID);
‎    }
‎
‎    // remove
‎    if (args[0] === "remove") {
‎        const key = text.slice(7).trim();
‎        const res = await fetch(`${link}?remove=${key}&senderID=${uid}`);
‎        return send(api, event.threadID, res.message, event.messageID);
‎    }
‎
‎    // rm index
‎    if (args[0] === "rm" && text.includes("-")) {
‎        const [msg, index] = text.slice(3).split(" - ");
‎        const res = await fetch(`${link}?remove=${msg}&index=${index}`);
‎        return send(api, event.threadID, res.message, event.messageID);
‎    }
‎
‎    // list
‎    if (args[0] === "list") {
‎        const all = args[1] === "all";
‎        const data = await fetch(`${link}?list=all`);
‎
‎        if (!all) return send(api, event.threadID, `Total Teach = ${data?.length || 0}`, event.messageID);
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
‎        return send(api, event.threadID, `👑 Teachers:\n${list}`, event.messageID);
‎    }
‎
‎    // msg list
‎    if (args[0] === "msg") {
‎        const key = text.slice(4);
‎        const res = await fetch(`${link}?list=${key}`);
‎        return send(api, event.threadID, `Message "${key}": ${res?.data}`, event.messageID);
‎    }
‎
‎    // edit reply
‎    if (args[0] === "edit") {
‎        const [oldMsg, newMsg] = text.slice(5).split(" - ");
‎        if (!newMsg) return send(api, event.threadID, "❌ Format: edit old - new", event.messageID);
‎
‎        const res = await fetch(`${link}?edit=${oldMsg}&replace=${newMsg}&senderID=${uid}`);
‎        return send(api, event.threadID, `✅ Updated: ${res.message}`, event.messageID);
‎    }
‎
‎    // teach
‎    if (args[0] === "teach") {
‎        let [command, reply] = text.split(" - ");
‎        const msg = command.replace("teach ", "");
‎        if (!reply) return send(api, event.threadID, "❌ Format: teach question - reply", event.messageID);
‎
‎        let url = `${link}?teach=${msg}&reply=${reply}&senderID=${uid}`;
‎        if (args[1] === "react") url = `${link}?teach=${msg}&react=${reply}`;
‎        if (args[1] === "amar") url += "&key=intro";
‎
‎        const res = await fetch(url);
‎        return send(api, event.threadID, `✅ Added reply\n${res.message}`, event.messageID);
‎    }
‎
‎    // name question
‎    if (["amar name ki", "amr nam ki", "whats my name"].some(p => text.includes(p))) {
‎        const res = await fetch(`${link}?text=amar name ki&senderID=${uid}&key=intro`);
‎        return send(api, event.threadID, res.reply, event.messageID);
‎    }
‎
‎    // normal chat
‎    const res = await fetch(`${link}?text=${encodeURIComponent(text)}&senderID=${uid}&font=1`);
‎    api.sendMessage(res.reply || "🥺💔", event.threadID, (_, info) => {
‎        global.GoatBot.onReply.set(info.messageID, {
‎            commandName: module.exports.config.name,
‎            type: "reply",
‎            author: uid
‎        });
‎    }, event.messageID);
‎};
‎
‎module.exports.onReply = async ({ api, event }) => {
‎    const txt = encodeURIComponent(event.body?.toLowerCase());
‎    const uid = event.senderID;
‎    const link = await baseApiUrl();
‎
‎    const res = await fetch(`${link}?text=${txt}&senderID=${uid}&font=1`);
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
‎        `আমাকে না ডেকে বস সজিব কে ডাক 😇🫦`,
‎        `আমি ব্যস্ত আছি 🙈`,
‎        `তুমি কি WiFi নাকি? দেখলেই connect 😌`,
‎        `এখন mood off 💗`,
‎        `তুমি নাকি আমার boss সজিব এর বউ 😥`,
‎        `বেশি bot bot করলে leave নিবো 😒`,
‎        `আমি আবাল দের সাথে কথা বলি না, ok 😹`,
‎        `এতো ডেকো না, প্রেম এ পরে যাবো 🙈`,
‎        `${name}, তুমি কি আমাকে ভালোবাসো? 😳💋`
‎    ];
‎
‎    if (!msg) return send(api, event.threadID, `✨ ${name} ✨\n\n${preset[Math.random()*preset.length|0]}`, event.messageID);
‎
‎    const res = await fetch(`${await baseApiUrl()}?text=${encodeURIComponent(msg)}&senderID=${uid}&font=1`);
‎    api.sendMessage(res.reply, event.threadID, event.messageID);
‎};
