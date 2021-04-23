const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')
var randomnumber = require('random-number');

module.exports = {
  name: 'daily',
  description: "Resgate seu daily de 12 horas",
  aliases: ['reward'],
  cooldown: 2,
  args: 0,
  category: '💰 Economia',
  async execute(message, args, client) {
    try {
      let user = message.author;

      let timeout = 43200000;
      let LastDaily = Util.NotNumberCheck(await db.get(`${user.id}_daily`));

      var options = { min: 500, max: 5500, integer: true }
      let Reward = randomnumber(options);

      let CurrentTimeStamp = new Date().getTime();
      let Message = `Espere **${Util.msToTime(timeout - (CurrentTimeStamp - LastDaily))}** Para resgatar sey daily novamente`;
      if (((CurrentTimeStamp - LastDaily) > timeout) || !LastDaily) {
        Message = `🎁 Você resgatou **${Util.moneyFormat(Reward)}** de coins diários!`;
        db.add(`${user.id}_balance`, Reward);
        db.set(`${user.id}_daily`, CurrentTimeStamp);
      }

      return message.channel.send({
        embed: {
          title: "Daily",
          description: Message,
          color: "#8B0000",
          timestamp: new Date()
        }
      });
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
