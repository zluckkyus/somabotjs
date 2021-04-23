const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')
var randomnumber = require('random-number');

module.exports = {
  name: 'semanal',
  description: "Pegue seu daily de 7 dias",
  aliases: ['week'],
  usage: '',
  cooldown: 2,
  args: 0,
  category: '💰 Economia',
  async execute(message, args, client) {
    try {
      let user = message.author;

      let timeout = 604800000;
      let LastDaily = Util.NotNumberCheck(await db.get(`${user.id}_weekly`));

      var options = { min: 2000, max: 27500, integer: true }
      let Reward = randomnumber(options);

      let CurrentTimeStamp = new Date().getTime();
      let Message = `Espere por **${Util.msToTime(timeout - (CurrentTimeStamp - LastDaily))}** para pegar sua recompensa semanal novamente!`;
      if (((CurrentTimeStamp - LastDaily) > timeout) || !LastDaily) {
        Message = `Você resgatou **${Util.moneyFormat(Reward)}** coins semanais.`;
        db.add(`${user.id}_balance`, Reward);
        db.set(`${user.id}_weekly`, CurrentTimeStamp);
      }

      return message.channel.send({
        embed: {
          title: "Recompensa Semanal",
          description: Message,
          color: "GREEN",
          timestamp: new Date()
        }
      });
    } catch (err) {
      console.log(err);
      return message.reply(`Oh erro, contate o dono.`);
    }
  }
};
