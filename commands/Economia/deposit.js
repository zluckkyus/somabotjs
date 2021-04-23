const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')

module.exports = {
  name: 'depositar',
  description: "Deposite seu dinheiro no cofre",
  aliases: ['dep'],
  usage: ' [quantidade]',
  cooldown: 2,
  args: 1,
  category: '💰 Economia',
  async execute(message, args, client) {
    try {
      let Balance = Util.NotNumberCheck(await db.get(`${message.author.id}_balance`));
      
      let ServerPrefix = await db.get(`prefix_${message.guild.id}`)
      let CurrentBase = await db.get(`${message.author.id}_base`);

      if (CurrentBase > -1) {
        let Value = args[0];
        if (isNaN(Value)) {
          if (Value.toLowerCase() == "all" || Value.toLowerCase() == "a") {
            Value = Balance;
          }
          else {
            return message.reply("**⚠️Você precisa digitar uma certa quantidade para depositar.**")
          }
        }
        else {
          Value = Util.NotNumberCheck(Value);
          if (Value > Balance) {
            return message.reply("**❌ Você não tem coins suficientes para depositar!**");
          }
        }

        await db.add(`${message.author.id}_vault`, Value);
        await db.subtract(`${message.author.id}_balance`, Value);

        let Message = `✅ Você depositou **${Util.moneyFormat(Value)}** para o seu banco`;
        return message.channel.send({
          embed: {
            title: "Coins Depositados",
            description: Message,
            color: "GREEN",
            timestamp: new Date()
          }
        });
      }
      else {
        message.reply(`❌ Compre um cofre para poder depositar seu dinheiro **s.base buy** para ter seu cofre!`);
      }
    } catch (e) {
      console.error(e)
    }
  }
};
