const discord = require("discord.js");

module.exports = {
  name: "kick",
  args: 0,
  category: "👮 Moderação",
  description: "Expulsar alguem do servidor",
  usage: "kick <@usuario> <motivo>",
  async execute(message, args, client) {
    
    const target = message.mentions.members.first()
    
    const reason = args.slice(1).join(" ")
    
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply(`🚫 **Você não tem permissão para usar este comando.`)
    
    if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply(`🚫 **Eu näo tenho permissão para expulsar alguem!**`)
    
    if(!args[0]) return message.reply(`⚠️ **Mencione alguem para expulsar.**`)
    
    if(!target) return message.reply(`🚫 **Eu não consigo encontrar este membro.**`)
    
    if(target.roles.highest.position >= message.member.roles.highest.position || message.author.id !== message.guild.owner.id) {
      return message.reply(`🚫 **Não posso expulsar ele, pois o cargo dele é maior que o meu!**`)
    }
    
    if(target.id === message.author.id) return message.reply(`🤷 **Baka! eu não posso expulsar você mesmo!**`)
    
    if(target.kickable) {
      let embed = new discord.MessageEmbed()
      .setAuthor(target.username.tag, target.avatarURL({dynamic: true, size: 1024}))
      .setColor("RANDOM")
      .setDescription(
        `
**❯ User:** ${target}
**❯ Action:** Kick
**❯ Reason:** \`${reason || "No Reason Provided"}\``)
      
      message.channel.send(embed)
      
      target.kick()
      
    } else {
      return message.reply(`I can't kick them, make sure that my role is above of theirs`)
    }
    return undefined
  }
};