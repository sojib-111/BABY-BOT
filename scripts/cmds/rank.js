const Canvas = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const { randomString } = global.utils;

function expToLevel(exp) {
  return Math.floor((1 + Math.sqrt(1 + 8 * exp / 5)) / 2);
}

function levelToExp(level) {
  return Math.floor(((level ** 2 - level) * 5) / 2);
}

// Generate random sparkles
function drawSparkles(ctx, width, height, count = 50) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.6 + 0.4;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.shadowColor = "#ff77ff";
    ctx.shadowBlur = 10;
    ctx.fill();
  }
}

module.exports = {
  config: {
    name: "rank",
    version: "4.0",
    author: "Huraira Sajib",
    role: 0,
    category: "ranking",
    guide: "{pn} | {pn} @user | reply {pn}"
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    let uid;
    if (event.messageReply) uid = event.messageReply.senderID;
    else if (Object.keys(event.mentions || {}).length > 0) uid = Object.keys(event.mentions)[0];
    else uid = event.senderID;

    const allUsers = await usersData.getAll();
    const sorted = allUsers
      .map(u => ({ id: u.userID, exp: u.exp || 0 }))
      .sort((a, b) => b.exp - a.exp);

    const rank = sorted.findIndex(u => u.id == uid) + 1;
    const total = sorted.length;

    const userData = await usersData.get(uid);
    if (!userData) return message.reply("❌ User data not found");

    const exp = userData.exp || 0;
    const level = expToLevel(exp);
    const nextExp = levelToExp(level + 1);
    const curExp = levelToExp(level);
    const needExp = nextExp - curExp;
    const progress = exp - curExp;

    // 🎨 CANVAS
    const canvas = Canvas.createCanvas(950, 350);
    const ctx = canvas.getContext("2d");

    // 🌌 Anime Neon Gradient BG
    const bgGrad = ctx.createLinearGradient(0, 0, 950, 0);
    bgGrad.addColorStop(0, "#ff77ff");
    bgGrad.addColorStop(0.5, "#77d6ff");
    bgGrad.addColorStop(1, "#a0ff77");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 950, 350);

    // ✨ Draw sparkles
    drawSparkles(ctx, 950, 350, 80);

    // 👤 Avatar
    const avatarURL = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatar = await Canvas.loadImage(avatarURL);
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 175, 100, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, 50, 75, 200, 200);
    ctx.restore();

    // ✨ Neon shadow for text
    ctx.shadowColor = "#ff77ff";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";

    // Name
    ctx.font = "bold 42px 'Arial'";
    ctx.fillText(userData.name, 280, 100);

    // Level & Rank
    ctx.font = "36px 'Arial'";
    ctx.shadowColor = "#77d6ff";
    ctx.shadowBlur = 15;
    ctx.fillText(`Level: ${level}`, 280, 160);
    ctx.fillText(`Rank: ${rank}/${total}`, 280, 210);
    ctx.fillText(`EXP: ${progress}/${needExp}`, 280, 260);

    // 🌈 Neon Anime EXP BAR
    const barX = 280, barY = 280, barW = 630, barH = 25;
    ctx.shadowBlur = 0;

    // Background bar
    ctx.fillStyle = "#222";
    ctx.fillRect(barX, barY, barW, barH);

    // Foreground gradient bar
    const percent = Math.min(progress / needExp, 1);
    const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    barGrad.addColorStop(0, "#ff77ff");
    barGrad.addColorStop(0.5, "#77d6ff");
    barGrad.addColorStop(1, "#a0ff77");
    ctx.shadowColor = "#ff77ff";
    ctx.shadowBlur = 25;
    ctx.fillStyle = barGrad;
    ctx.fillRect(barX, barY, barW * percent, barH);

    // 💾 Save image
    const imgPath = path.join(__dirname, "cache", `rank_${randomString(6)}.png`);
    await fs.ensureDir(path.dirname(imgPath));
    await fs.writeFile(imgPath, canvas.toBuffer());

    return message.reply({
      body: "🌸 Anime Neon-Style Rank Card w/ Sparkles 🌸",
      attachment: fs.createReadStream(imgPath)
    });
  }
};
