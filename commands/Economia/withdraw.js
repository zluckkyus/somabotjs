const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')

module.exports = {
  name: 'sacar',
  description: "Deposite suas moedas no banco.",
  aliases: ['with'],
  usage: ' [amount]',
  cooldown: 2,
  args: 1,
  category: '💰 Economia',
  async execute(message, args, client) {
    try {
      let Balance = Util.NotNumberCheck(await db.get(`${message.author.id}_vault`));

      let Value = args[0];
      if (isNaN(Value)) {
        if (Value.toLowerCase() == "all" || Value.toLowerCase() == "a") {
          Value = Balance;
        }
        else {
          return message.reply("⚠️ Coloque uma quantidade para sacar!")
        }
      }
      else {
        Value = Util.NotNumberCheck(Value);
        if (Value > Balance) {
          return message.reply("❌ Você não tem dinheiro em seu cofre para sacar.");
        }
      }
      
      db.add(`${message.author.id}_balance`, Value);
      db.subtract(`${message.author.id}_vault`, Value);

      let Message = `Você depositou **${Util.moneyFormat(Value)}** da sua carteira para o cofre`;
      return message.channel.send({
        embed: {
          title: "Saque",
          description: Message,
          color: "GREEN",
          footer: {
            text: "Saque por " + message.author.tag,
            icon_url: message.author.displayAvatarURL()
          },
          timestamp: new Date()
        }
      });
    } catch (e) {
      console.error(e)
    }
  }
};
