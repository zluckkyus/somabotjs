const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'shop',
    description: "Compre e veja itens que estão a venda.",
    aliases: ['shops'],
    usage: ' [buy/view] [option] [quantity]',
    cooldown: 2,
    args: 0,
    category: '💰 Economia',
    async execute(message, args, client) {
        try {
            let ServerPrefix = await db.get(`prefix_${message.guild.id}`)

            let rawdata = fs.readFileSync('./include/assets/json/game.json');
            let Game = JSON.parse(rawdata);

            let Shops = Game.data["Shops"];

            let CurrentUpgrade = [];
            for (let i = 0; i < Shops.length; i++) {
                CurrentUpgrade.push(Util.NotNumberCheck(await db.get(`${message.author.id}_${Shops[i]}`))); 
            }

            let Option = args[0];
            if (Option == "buy") {
                let BuyOption = args[1];
                let Quantity = 1;
                if (!isNaN(args[2]) && args[2] > 0) {
                    Quantity = args[2];
                }

                if (!isNaN(BuyOption)) {
                    let UserBalance = await db.get(`${message.author.id}_balance`);
                    BuyOption -= 1;

                    if ((BuyOption + 1) < 1 || (BuyOption + 1) > Shops.length) {
                        return message.reply("⚠️ Certifique-se de que seu ID de compra é adequado!");
                    }

                    let CostofItem = Game.shop[Shops[BuyOption]].value * Quantity;
                    if (UserBalance < CostofItem) {
                        return message.reply("⚠️ Verifique se você tem coins suficientes para comprar!")
                    }

                    db.subtract(`${message.author.id}_balance`, CostofItem);
                    db.add(`${message.author.id}_${Shops[BuyOption]}`, Quantity);

                    return message.channel.send({
                        embed: {
                            title: "Item Comprado",
                            description: `Você comprou **${Game.shop[Shops[BuyOption]].lebel} x(${Quantity})** !`,
                            color: "RANDOM",
                            footer: {
                                text: "Executado por " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }
                else {
                    let ShopEmbed = new Discord.MessageEmbed()
                    .setTitle(`Shop`)
                    .setColor("RANDOM")
                    .setDescription(`Peço que use **${ServerPrefix}shop buy [id]**. Depois de comprar algo, você pode usá-lo para atividades como a pesca...`)
                    .setFooter("Executado por " + message.author.tag);

                for (let i = 0; i < Shops.length; i++) {
                    let Catergory = `**${i + 1}) ${Game.shop[Shops[i]].lebel} (${CurrentUpgrade[i]})**`;
                    let Description = `${Game.shop[Shops[i]].description}\n\n`;

                    Description += `**Preço:** ${Util.moneyFormat(Game.shop[Shops[i]].value)}\n`;

                    ShopEmbed.addField(Catergory, Description, true);
                }

                return message.channel.send(ShopEmbed);
                }
            }
            else {
                let ShopEmbed = new Discord.MessageEmbed()
                    .setTitle(`Shop`)
                    .setColor("RANDOM")
                    .setDescription(`Peço que use **${ServerPrefix}shop buy [id]**. Depois de comprar algo, você pode usá-lo para atividades como a pesca...`)
                    .setFooter("Executado por " + message.author.tag);

                for (let i = 0; i < Shops.length; i++) {
                    let Catergory = `**${i + 1}) ${Game.shop[Shops[i]].lebel} (${CurrentUpgrade[i]})**`;
                    let Description = `${Game.shop[Shops[i]].description}\n\n`;

                    Description += `**Preço:** ${Util.moneyFormat(Game.shop[Shops[i]].value)}\n`;

                    ShopEmbed.addField(Catergory, Description, true);
                }

                return message.channel.send(ShopEmbed);
            }

        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
