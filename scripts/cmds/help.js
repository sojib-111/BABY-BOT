module.exports = {
  config: {
    name: "help",
    aliases: ["h", "help"],
    version: "2.8",
    author: "TAREK",
    countDown: 5,
    role: 0,
    shortDescription: "Display categorized command list",
    longDescription: "Shows all available bot commands organized by category or role.",
    category: "info",
    guide: {
      en: "• .help [empty | <page number> | <command name>]\n• .help <command name> [-u | usage | -g | guide]\n• .help <command name> [-i | info]\n• .help <command name> [-r | role]\n• .help <command name> [-a | alias]\n• .help -<category>: show only commands in that category\n• .help _ role <0|1|2>: show only commands of that role (with categories)"
    }
  },

  onStart: async function ({ message, args, event, threadsData }) {
    const allCommands = global.GoatBot.commands;
    const prefix =
      (await threadsData.get(event.threadID))?.prefix ||
      global.GoatBot.config.prefix;

    // Group by category
    const categories = {};
    for (const cmd of allCommands.values()) {
      const cat = (cmd.config.category || "Uncategorized").toUpperCase();
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd);
    }
    const sortedCategories = Object.keys(categories).sort();

    const arg = args[0];
    const flag = args[1]?.toLowerCase();

    // ✅ Case: Role-based list (with categories)
    if (arg === "_" && flag === "role") {
      const roleNum = parseInt(args[2]);
      if (![0, 1, 2].includes(roleNum)) {
        return message.reply("❌ Role must be 0, 1, or 2.");
      }

      let msg = `֍─────| ROLE ${roleNum} |─────֎\n\n`;

      let totalRoleCmds = 0;
      for (const cat of sortedCategories) {
        const cmdsInRole = categories[cat].filter(
          (c) => c.config.role === roleNum
        );
        if (cmdsInRole.length > 0) {
          msg += `╭──⦿ 【 ${cat} 】\n`;
          msg += `✧${cmdsInRole.map((c) => c.config.name).join(" ✧")}\n`;
          msg += "╰────────⦿\n";
          totalRoleCmds += cmdsInRole.length;
        }
      }

      msg += "╭──────────⦿\n";
      msg += `│ 𝗧𝗼𝘁𝗮𝗹 𝗶𝗻 ROLE ${roleNum}:「${totalRoleCmds}」\n`;
      msg += `│ 𝗔𝗹𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:「${allCommands.size}」\n`;
      msg += `│ 𝗢𝘄𝗻𝗲𝗿: 𝗦𝗢𝗝𝗜𝗕\n`;
      msg += `│ 𝗣𝗿𝗲𝗳𝗶𝘅: [ ${prefix} ] \n`;
      msg += "╰─────────────⦿";

      return message.reply(msg);
    }

    // ✅ Case: Category filter
    if (
      arg &&
      arg.startsWith("-") &&
      !["-u", "usage", "-g", "guide", "-i", "info", "-r", "role", "-a", "alias"].includes(
        arg
      )
    ) {
      const inputCategory = arg.slice(1).toUpperCase();
      if (!categories[inputCategory]) {
        return message.reply(
          `❌ Category "${inputCategory}" not found.\nAvailable: ${sortedCategories.join(
            ", "
          )}`
        );
      }

      let msg = `╭──⦿ 【 ${inputCategory} 】\n`;
      msg += `✧${categories[inputCategory]
        .map((c) => c.config.name)
        .join(" ✧")}\n`;
      msg += "╰────────⦿\n";

      msg += "╭──────────⦿\n";
      msg += `│ 𝗧𝗼𝘁𝗮𝗹 𝗶𝗻 ${inputCategory}:「${categories[inputCategory].length}」\n`;
      msg += `│ 𝗔𝗹𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:「${allCommands.size}」\n`;
      msg += `│ 𝗢𝘄𝗻𝗲𝗿: 𝗦𝗢𝗝𝗜𝗕\n`;
      msg += `│ 𝗣𝗿𝗲𝗳𝗶𝘅: [ ${prefix} ] \n`;
      msg += "╰─────────────⦿";

      return message.reply(msg);
    }

    // ✅ Case: Command info
    if (arg && isNaN(arg)) {
      const input = arg.toLowerCase();
      const command =
        allCommands.get(input) ||
        allCommands.get(global.GoatBot.aliases.get(input));
      if (!command) return message.reply(`❌ Command "${input}" not found.`);

      const config = command.config;
      const guide =
        typeof config.guide === "object"
          ? config.guide.en
          : config.guide || "Not provided";
      const aliases = config.aliases?.join(", ") || "Do not have";

      let msg = "";

      switch (flag) {
        case "-u":
        case "usage":
        case "-g":
        case "guide":
          msg += "֍─────| USAGE |─────֎\n";
          msg += `🛠 ${guide}\n`;
          msg += "╰────────────────⦿\n";
          break;
        case "-i":
        case "info":
          msg += "֍─────| INFO |──────֎\n";
          msg += `🛠 Command name: ${prefix}${config.name}\n`;
          msg += `📝 Description: ${
            config.longDescription || config.shortDescription || "Not provided"
          }\n`;
          msg += `🌊 Other names: ${aliases}\n`;
          msg += `📦 Version: ${config.version || "1.0"}\n`;
          msg += `🎭 Role: ${config.role}\n`;
          msg += `⏱ Time per command: ${config.countDown || "1s"}\n`;
          msg += `✍️ Author: ${config.author || "Unknown"}\n`;
          msg += "╰───────────────⦿\n";
          break;
        case "-r":
        case "role":
          msg += "֍────| ROLE |────֎\n";
          msg += `🎭 ${config.role} (${
            config.role === 0 ? "All users" : "Restricted"
          })\n`;
          msg += "╰─────────────⦿\n";
          break;
        case "-a":
        case "alias":
          msg += "֍─────| ALIAS |─────֎\n";
          msg += `🌊 Other names: ${aliases}\n`;
          msg += "╰───────────────⦿\n";
          break;
        default:
          msg += "֎─────────────────֍\n";
          msg += "📌 Command Information\n\n";
          msg += `💠 Name: ${prefix}${config.name}\n`;
          msg += `📝 Description: ${
            config.longDescription || config.shortDescription || "Not provided"
          }\n`;
          msg += `📦 Version: ${config.version || "1.0"}\n`;
          msg += `✍️ Author: ${config.author || "Unknown"}\n`;
          msg += `🎭 Role Required: ${config.role}\n`;
          msg += `🌊 Aliases: ${aliases}\n`;
          msg += `🛠 Usage: ${guide}\n`;
          msg += "╰─────────────────⦿\n";
          break;
      }

      return message.reply(msg);
    }

    // ✅ Case: Show all categories + commands
    let msg = "";
    for (const cat of sortedCategories) {
      msg += `╭──⦿ 【 ${cat} 】\n`;
      msg += `✧${categories[cat].map((c) => c.config.name).join(" ✧")}\n`;
      msg += "╰────────⦿\n";
    }

    msg += "╭──────────⦿\n";
    msg += `│ 𝗔𝗹𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:「${allCommands.size}」\n`;
    msg += `│ 𝗢𝘄𝗻𝗲𝗿: 𝗦𝗢𝗝𝗜𝗕\n`;
    msg += `│ 𝗣𝗿𝗲𝗳𝗶𝘅: [ ${prefix} ] \n`;
    msg += "╰─────────────⦿";

    return message.reply(msg);
  },
};
