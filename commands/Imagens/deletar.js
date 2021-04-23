const Discord = require('discord.js')
const Caxinha = require('caxinha')

module.exports = {
  name: "deletar",
  aliases: ["del"],
  args: 0,
  category: "🖼 Imagens",
  description: "Delete ele!",
  async execute(message, args, client) {
    message.channel.startTyping(1);
    message.channel.stopTyping(true);
    
    let usr = message.mentions.users.first() || message.author
    
    let image = await Caxinha.canvas.del(usr.displayAvatarURL({ dynamic: false, format: 'png' }));

    let attachment = new Discord.MessageAttachment(image, "deletar.png");

    return message.channel.send(attachment);
    
    message.channel.stopTyping()
  }
}