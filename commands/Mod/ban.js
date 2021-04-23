const discord = require("discord.js");

module.exports = {
  name: "ban",
  category: "👮 Moderação",
  description: "Bane o usuario do servidor!",
  usage: "@usuario <motivo>",
  args: 0,
  async execute(message, args, client) {
    
    const target = message.mentions.members.first()
    
    const reason = args.slice(1).join(" ")
    
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply(`🚫 **Você não tem permissão para usar este comando.`)
    
    if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply(`🚫 **Eu näo tenho permissão para banir alguem!**`)
    
    if(!args[0]) return message.reply(`⚠️ **Mencione alguem para banir.**`)
    
    if(!target) return message.reply(`🚫 **Eu não consigo encontrar este membro.**`)
    
    if(target.roles.highest.position >= message.member.roles.highest.position || message.author.id !== message.guild.owner.id) {
      return message.reply(`🚫 **Não posso banir ele, pois o cargo dele é maior que o meu!**`)
    }
    
    if(target.id === message.author.id) return message.reply(`🤷 **Baka! eu não posso banir você mesmo!**`)
    
    if(target.bannable) {
      let embed = new discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`<:DE_BanHammer:809124592575709265> Banido ${target}\n⚠️ Motivo: \`${reason || "Motivo não foi adicionado"}\``)
      .setFooter(`${message.author.username} Moderador`)
      .setTimestamp()
      
      message.channel.send(embed)
      
      target.ban()
      
      message.delete()
      
    } else {
      return message.reply(`🚫 **Não consigo banir ele pois o cargo dele é maior que o meu...**`)
    }
    return undefined
  }
};