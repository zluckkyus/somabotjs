const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

module.exports = {
  name: 'setprefix',
  description: 'Muda meu prefixo',
  aliases: ['sp'],
  usage: ' [prefix]',
  cooldown: 2,
  args: 1,
  category: '👮 Moderação',
  async execute(message, args, client) {
    try {
      let ServerPrefix = args[0];
      if (ServerPrefix.length > 5 || ServerPrefix.length < 1) {
        return message.reply("⚠️ Coloque um prefixo até 1-5 Carateres");
      }

      if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.reply("❌ Verifique se você é adminstrador!")
      }

      await db.set(`${message.guild.id}_prefix`, ServerPrefix);
      return message.channel.send({
        embed: {
          title: "Novo Prefixo",
          description: `**Server Prefix:** ${ServerPrefix}`,
          color: "GREEN",
          footer: {
            text: "Pedido por " + message.author.tag,
            icon_url: message.author.displayAvatarURL()
          },
          timestamp: new Date()
        }
      });
    } catch (err) {
      console.log(err);
      return message.reply(`Ocorreu um erro`);
    }
  }
};