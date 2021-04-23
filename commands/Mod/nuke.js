const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "nuke",
  usage: " ",
  category: "👮 Moderação",
  description: "Este comando recria o canal e deleta o antigo.",
  async execute(message, args, client) {
  try {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("🚫 **| Você não tem Permissão para executar este comando!**")
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send("🚫 **| Eu não tenho Permissão para executar este comando!**")
    
    let sucesso = "Este canal foi Nukado! 🌋"
    let pos = message.channel.position
    let em = new MessageEmbed()
     .setColor("ORANGE")
     .setTitle("Verifique")
     .setDescription("Você tem certeza que vai nukar este canal?")
    
    return message.channel.send(em).then(msg => {
      msg.react("✅")
      msg.react("❌")
    
    
    const sim = msg.createReactionCollector((reaction, user) => reaction.emoji.name == `✅` && user.id == message.author.id) //time: tempo, 1000 = 1sec, 10000 = 10sec

    const nao = msg.createReactionCollector((reaction, user) => reaction.emoji.name == `❌` && user.id == message.author.id) //time: tempo, 1000 = 1sec, 10000 = 10sec
    
    sim.on("collect", s => {
      msg.reactions.removeAll()
      Promise.all(message.channel.clone().then(si => {
        message.channel.delete()
        si.setPosition(pos)
        si.send(sucesso)
      })
      .catch(error => error.send("❌ **Ocorreu algum erro ao deletar o canal, pelo visto o canal é especial, então não posso deletar ele.")))
    })
    nao.on("collect", n => {
      msg.reactions.removeAll()
      message.channel.send("✅ Pedido cancelado.")
    })
    })
  } catch(e) {
    return message.channel.send({
      embed: {
        title: "Erro",
        color: "RED",
        description: "Este canal é especial portanto não consigo deletar."
      }
    })
  }
}
}