const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "blacklist",
  hidden: true,
  category: "✨ Especiais",
  async execute(message, args, client) {
    if (message.author.id !== '777205185582727188') return message.channel.send("🚫 **Somente meu criador pode usar este comando!**");
    
    let usr = message.mentions.users.first()
    let reason = args.slice(1).join(" ")
    
    // EMBEDS
    let pq = new MessageEmbed()
     .setTitle("Erro")
     .setColor("BLUE")
     .setDescription("Você não pode bloquear você mesmo.")
    
    let add = new MessageEmbed()
     .setColor("RED")
     .setTitle("BlackList")
     .setDescription(`Você está na blacklist e portanto não poderá usar meus comandos pelo motivo. \`${reason}\``)
    
    let errusr = new MessageEmbed()
      .setTitle("Erro")
      .setColor("YELLOW")
      .setDescription("Mencione algum usuario!")
    
    let errrsn = new MessageEmbed()
     .setTitle("Erro")
     .setColor("ORANGE")
     .setDescription("Coloque algum motivo.")
    
     // IF (CHECK ARGS)
    if (!usr) {
       return message.channel.send(errusr)
    }
     
    if (!reason) {
       return message.channel.send(errrsn)
    }
    
    if (usr === message.author.id) {
      return message.channel.send(pq)
    }
    // CONFIG
    
    message.channel.send(add)
    
    db.set(`bl_${usr.id}`, `true`)
    db.set(`blmsg_${usr.id}`, `${reason}`)
    
  }
}