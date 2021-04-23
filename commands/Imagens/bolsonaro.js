const jimp = require("jimp")
const Discord = require('discord.js')
const cooldowns = {}
const ms = require("ms")

module.exports = {
  name: "bolsonaro",
  description: "Faça o bolsoninho falar algo.",
  category: "🖼 Imagens",
  usage: "[texto]",
  async execute(message, args, client) {

    if(!cooldowns[message.author.id]) cooldowns[message.author.id] = {
        lastCmd: null
      }
let ultimoCmd = cooldowns[message.author.id].lastCmd 
     let timeout = 10000
    if (ultimoCmd !== null && timeout- (Date.now() - ultimoCmd) > 0) {
let time = ms(timeout - (Date.now() - ultimoCmd)); 
let resta = [time.seconds, 'segundos']
 
if(resta[0] == 0) resta = ['alguns', 'millisegundos']
if(resta[0] == 1) resta = [time.seconds, 'segundo']
const aguarde = new Discord.MessageEmbed()
  .setTitle('⏰ | Calma Rapaz, tenha um pouco de calma.')
  .setColor('#ff0000')
  .setDescription(`⚠️ | **Por favor ${message.author}, espere **\`${time}\`** para executar outro comando**`)
        message.channel.send(`⚠️ | Espere um pouco para utilizar esse comando novamente`).then(msg=> {
    msg.delete({ timeout: 600000 });
        })
       return;
    } else {
                 cooldowns[message.author.id].lastCmd = Date.now() 
    }

        let img = jimp.read("https://cdn.discordapp.com/attachments/814270412422119435/816055040031719424/PicsArt_03-01-06.07.10.png")
        if (!args[0]) return message.reply("⚠️ | Escreva algo para o bolsonaro falar.")
                        img.then(image => {
                          jimp.loadFont(jimp.FONT_SANS_32_BLACK).then(font => {
                       image.resize(885, 494)
                                           image.print(font, 450, 180, args.join(" "), 7000)
                image.getBuffer(jimp.MIME_PNG, (err, i) => {
                    message.channel.send({files: [{ attachment: i, name: "bolsonaro.png"}]})
                })
            })
        })
    }
}