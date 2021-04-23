const { MessageEmbed, version } = require('discord.js')
const moment = require("moment");
const m = require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")
const ms = require("ms")

module.exports = {
  name: "botinfo",
  category: "🍦 Utilidades",
  description: "Veja as informações sobre o bot.",
  aliases: ["bi","info"],
  args: 0,
  async execute(message, args, client) {
    let botinfo = new MessageEmbed()
     .setColor("#303136")
     .setAuthor(client.user.username, client.user.displayAvatarURL({}))
     .setTimestamp()
     .setDescription(`<a:Yu_Crc:815948710629736458> Um simples bot para discord criado por uma pessoa incrivel usando a linguagem [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) fui criado por [zLuckkyUS.js#7601](https://github./tgkevinbr)\n\n**(🔗) Links:\n[Votar](https://bluephoenixlist.tk/bot/790785456773136384/vote) **\n\n**(🏙) Guilds**\n:🏮 | Servidores - \`${client.guilds.cache.size}\`\n🏷 | Canais - \`${client.channels.cache.size}\`\n\n**(🥀) Informações**\n🖥 | CPU - \`${os.cpus().map(i => `${i.model}`)[0]}\`\n📀 | [Discord.js](https://discord.js.org/#/) - \`v${version}\`\n🏦 | DataBase - [Easily.db](https://npmjs.com/package/easily.db)\n💿 | NodeJS - [${process.version}](https://nodejs.org/)\n\n**(🧙‍♂️) Beta Testers**\n• **\`KENJI#0402\`**\n• **\`viitor#0739\`\n• \`๖ۣۜSistem 悪#7344\`**`)
    message.reply(botinfo)
  }
}