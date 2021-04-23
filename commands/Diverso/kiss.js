const Caxinha = require('caxinha')
const discord = require('discord.js')

module.exports = {
  name: "kiss",
  args: 0,
  category: "🎉 Diversão",
  async execute(message, args, client) {
    let image = await Caxinha.gif.kiss();
    let usr = message.mentions.users.first()
    
    if (!usr) return message.channel.send("🤷 **Você quer beijar quem? mencione alguem!**")
    
    let kis = new discord.MessageEmbed()
     .setTitle("💗 o Amor está no ar")
     .setColor("RANDOM")
     .setDescription(`**${message.author} Beijou ${usr}**`)
     .setImage(image)
    return message.channel.send(kis);
  }
}