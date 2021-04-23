const Discord = require('discord.js')
const Caxinha = require('caxinha')

module.exports = {
  name: "triggered",
args: 0,
  category: "🖼 Imagens",
  description: "Você ta com raiva?",
  async execute(message, args, client) {
    message.channel.startTyping(1);
    message.channel.stopTyping(true);
    
    let usr = message.mentions.users.first() || message.author
    
    let image = await Caxinha.canvas.triggered(usr.displayAvatarURL({ dynamic: false, format: 'png' }));

    let attachment = new Discord.MessageAttachment(image, "triggered.gif");

    return message.channel.send(attachment);
    
    message.channel.stopTyping()
  }
}