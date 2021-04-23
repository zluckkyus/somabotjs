const Discord = require("discord.js");

module.exports = {
  name: "petpat",
  aliases: ["pet"],
  category: "🖼 Imagens",
  args: 0,
  description: "Faça carinho no seu pet",
  usage: "[menção] (opicional)",
  async execute(message, args, client) {
   const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    try {
    return message.channel.send(new Discord.MessageAttachment(encodeURI(`https://api.monkedev.com/canvas/petpet?imgUrl=${Member.user.displayAvatarURL({ format: "png" })}`), "Petpat.gif"));
    } catch (_) {
      return message.channel.send("Ocorreu algum erro!");
    }
  }
}