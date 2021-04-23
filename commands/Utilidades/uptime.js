const Discord = require("discord.js");

module.exports = {
  name: "uptime",
  args: 0,
  category: "🍦 Utilidades",
  aliases: ["up"],
  async execute(message, args, client) {
  let totalSeconds = client.uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  let uptime = `⏰ ${days.toFixed()}d ${hours.toFixed()}h ${minutes.toFixed()}m ${seconds.toFixed()}s`;

  const embed = new Discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL({}))
    .setColor("#FF0000")
    .setDescription(`**Estou online há:**\n${uptime}`)

  message.channel.send(embed);
}
}