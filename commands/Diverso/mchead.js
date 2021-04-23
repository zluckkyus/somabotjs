const Discord = require("discord.js");

module.exports = {
  name: "mchead",
  args: 0,
  category: "🎉 Diversão",
  async execute(message, args, client) {

    let reason = args.slice(0).join(' ');
    if (reason.length < 1) return message.reply('⚠️ **Cite um nick de Minecraft!**')

    let embed = new Discord.MessageEmbed()

        .setTitle(`Nickname: ${args[0]}`)
        .setDescription(` **[Baixe-a](https://mc-heads.net/head/${args[0]})**`)
        .setImage(`https://mc-heads.net/head/${args[0]}`)
        .setFooter(message.author.tag, message.author.avatarURL)
        .setColor("#ff0000")
    message.channel.send(embed)
 }
}