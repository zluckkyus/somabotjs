const discord = require("discord.js");

module.exports = {
  name: "invite",
  args: 0,
  category: "š¦ Utilidades",
  description: "Me convide para seu servidor!",
  async execute(message, args, client) {
    
    let embed = new discord.MessageEmbed()
    .setTitle(`Me Convide!`)
    .setDescription(`š§š· [Convite](https://discord.com/api/oauth2/authorize?client_id=790785456773136384&permissions=8&scope=bot)\n\nš [Servidor de Suporte](https://discord.gg/Vxsh9vMJBj)`)
    .setColor("RANDOM")
    .setTimestamp(message.timestamp = Date.now())
    
    message.channel.send(embed)
    
  
  }
}