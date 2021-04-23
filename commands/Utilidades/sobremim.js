const Discord = require('discord.js')
const db = require('../../util/Database.js')

module.exports = {
  name: "sobremim",
  args: 0,
  category: '🍦 Utilidades',
  async execute(message, args, client) {
    let mim = args.join(" ")
    if (!mim) {
      let em = new Discord.MessageEmbed()
       .setColor('#303136')
       .setDescription('Coloque alguma mensagem.')
      return message.channel.send(em)
        }
    if (mim > 70) {
      let em = new Discord.MessageEmbed()
       .setColor("#303136")
       .setDescription('Você só pode colocar até 70 Caracteres.')
    }
    
    let embed = new Discord.MessageEmbed()
     .setColor('#303136')
     .setDescription('Mensagem definida com sucesso!')
     
    message.channel.send(embed)
    db.set(`Perfil/${message.author.id}`, mim)
  }
}