const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')
var randomnumber = require('random-number');

module.exports = {
    name: 'beg',
    description: "Mendigue por um pouco de dinheiro",
    aliases: ['b'],
    usage: '',
    cooldown: 5,
    args: 0,
    category: '💰 Economia',
    async execute(message, args, client) {
        try {
            let user = message.author;

            let Reward = Util.getRandomInt(1, 50);

            let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
            Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

            if (Luck > 0) {
                Luck = (Reward / 100) * Luck;
            }

            Reward += Luck;

            const member = message.guild.members.cache.random(1)[0];
            Message = `Uma pessoa boa, passou por você e era o **(${member.user.username})** e lhe deu **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** para você.`;
            db.add(`${user.id}_balance`, Util.NotNumberCheck(Reward));

            return message.channel.send({
                embed: {
                    title: "Mendigando",
                    description: Message,
                    color: "RANDOM",
                    timestamp: new Date()
                }
            });
        }
        catch (err) {
            console.log(err);
            return message.reply(`❌ Ocorreu um erro.`);
        }
    }
};
