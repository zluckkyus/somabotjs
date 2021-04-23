const Caxinha = require('caxinha')
const discord = require('discord.js')

module.exports = {
  name: "slap",
  args: 0,
  category: "🎉 Diversão",
  async execute(message, args, client) {
    let image = await Caxinha.gif.slap();
    let usr = message.mentions.users.first()
    
    if (!usr) return message.channel.send("🤷 **Como você quer dar um tapa em alguem? mencione alguem!**")
    
    let kis = new discord.MessageEmbed()
     .setTitle("✋ Que tapão kk")
     .setColor("RANDOM")
     .setDescription(`**${message.author} Deu um tapa em ${usr}**`)
     .setImage(image)
    return message.channel.send(kis);
  }
}