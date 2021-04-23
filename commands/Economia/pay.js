const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')

module.exports = {
    name: 'pagar',
    description: "Pay a specific amount to someone else",
    aliases: ['give', 'donate','pay'],
    usage: ' [user] [amount]',
    cooldown: 2,
    args: 2,
    category: '💰 Economia',
    async execute(message, args, client) {
        try {
            let Amount = 0;

            if (!isNaN(args[0])) {
                Amount = Util.NotNumberCheck(args[0]);
            }
            else if (!isNaN(args[1])) {
                Amount = Util.NotNumberCheck(args[1]);
            }

            if (Amount < 100) {
                return message.reply("⚠️ Você só pode enviar pagamentos apenas 100 Coins ou mais, para o usuario!")
            }

            let UserBalance = await db.get(`${message.author.id}_balance`);
            if (UserBalance < Amount) {
                return message.reply("⚠️ Você não pode transferir mais do que você tem!");
            }

            if (!message.mentions.members.first()) {
                return message.reply("⚠️ Verifique se mencionou um usuario valido");
            }

            let User = message.mentions.members.first().user;
            let TransectionAmount = Math.floor((Amount / 100) * 5);

            db.add(`${User.id}_balance`, Math.floor(Amount - TransectionAmount));
            db.subtract(`${message.author.id}_balance`, Math.floor(Amount));

            let Message = ""; 
            Message += `**Usuario:**     ${User.username}\n`;
            Message += `**Quantidade:**   ${Util.moneyFormat(Amount - TransectionAmount)}\n`;
            Message += `**Taxa (5%):** ${Util.moneyFormat(TransectionAmount)}\n`;

            return message.channel.send({
                embed: {
                    title: "Pagamento",
                    description: Message,
                    color: "GREEN",
                    footer: {
                        text: "Executado por " + message.author.tag,
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
