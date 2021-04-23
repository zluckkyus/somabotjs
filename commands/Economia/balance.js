const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

module.exports = {
  name: 'balance',
  description: "Retorna o saldo do usuario",
  aliases: ['bal'],
  usage: ' [user - Opcional]',
  cooldown: 2,
  args: 0,
  category: '💰 Economia',
  async execute(message, args, client) {
    try {
      let user = message.author;
      if (message.mentions.members.first()) {
        user = message.mentions.members.first().user;
      }

      let HasVault = await db.has(`${user.id}_vault`);
      if (!HasVault) {
        db.set(`${user.id}_vault`, 0)
      }


      let Balance = Util.NotNumberCheck(await db.get(`${user.id}_balance`));
      let Vault = Util.NotNumberCheck(await db.get(`${user.id}_vault`));

      Message = `**Saldo**: ${Util.moneyFormat(Balance)}\n`;
    
      if (message.mentions.members.first()) {
        let Length = Vault.toString().length;
        let Dollars = "";
        for (let i = 0; i < Length; i++) {
          Dollars += "$";
        }

        Message += `**Banco**: ${Dollars}`;
      }
      else {
        Message += `**Banco**: ${Util.moneyFormat(Vault)}\n`;
      }

      return message.channel.send({
        embed: {
          title: `${user.username}`,
          description: Message,
          color: "RANDOM",
          footer: {
            text: "Pedido por " + message.author.tag,
            icon_url: message.author.displayAvatarURL()
          },
          timestamp: new Date()
        }
      });
    } catch (err) {
      console.log(err);
      return message.reply(`❌ Ocorreu um erro tente novamente mais tarde`);
    }
  }
};
