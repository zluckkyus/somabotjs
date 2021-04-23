const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')
const ownerid = '777205185582727188'

module.exports = {
  name: 'addbal',
  description: "[OWNER] Adiciona saldo ao usuario",
  aliases: ['addbalance', 'givebal', 'addball'],
  usage: ' [usuario] [quantidade]',
  cooldown: 2,
  args: 2,
  category: '💰 Economia',
  hidden: true,
  async execute(message, args, client) {
    try {
      if (isNaN(args[1])) return;
      if (message.author.id !== ownerid) return;
      let user = message.mentions.members.first();

      db.add(`${user.id}_balance`, args[1]);
      let Message = "🎁 Adicionando " + Util.moneyFormat(args[1]) + " para " + user.user.username;
      return message.channel.send({
        embed: {
          title: "Adicionando Valor",
          description: Message,
          color: "#8B0000",
          timestamp: new Date()
        }
      });
    } catch (e) {
      console.error(e)
    }
  }
};
