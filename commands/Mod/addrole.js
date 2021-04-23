const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "addrole",
  aliases: ["role"],
  args: 0,
  category: "👮 Moderação",
  description: "Adicione um cargo para o usuario.",
  async execute(message, args, client) {
   if (!message.member.hasPermission("MANAGE_ROLES")) {
      return message.channel.send("🚫 **Você precisa da permissão de `GERÊNCIAR_CARGOS` para utilizar este comando.");
    }
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
      return message.channel.send("🤷 **Eu não tenho permissão pra usar este comando.**");
    } 
    let target = message.mentions.members.first();
    
    if(!target) return message.reply(`🤷 **Eu não encontrei nenhum usuario, mencione ele!`)
    
    let arole = message.mentions.roles.first();
    
    if(!arole) return message.reply(`🤷 **Eu não encontrei nenhum cargo, mencione o cargo!`)
    
    let ticon = target.user.avatarURL({ dynamic: true, size: 2048 });
    let aicon = message.author.avatarURL({ dynamic: true, size: 2048 });
    
      const embed = new MessageEmbed()
      
      .setColor("RANDOM")
      .setDescription(`🎄 ${target.user.username} Recebeu o cargo ${arole}`)
      
      await message.channel.send(embed)
      
      target.roles.add(arole)
    
  }
}