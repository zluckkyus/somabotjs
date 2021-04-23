const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')
const Discord = require('discord.js');
const fs = require('fs');

let rawdata = fs.readFileSync('./include/assets/json/game.json');
let Game = JSON.parse(rawdata);

module.exports = {
    name: 'base',
    description: "Compre ou veja bases!",
    aliases: ['bases'],
    usage: ' [buy/view] [opções]',
    cooldown: 5,
    args: 0,
    category: '💰 Economia',
    async execute(message, args, client) {
        try {
            let Options = args[0];
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`)
            let CurrentBase = await db.get(`${message.author.id}_base`);

            let Bases = Game.data["Bases"];

            if (Options == "buy" ||
                CurrentBase == -1) {

                let BuyOption = args[1];
                if (!isNaN(BuyOption)) {
                    let UserBalance = Util.NotNumberCheck(await db.get(`${message.author.id}_balance`));
                    BuyOption -= 1;

                    if ((BuyOption + 1) < 1 || (BuyOption + 1) > Bases.length) {
                        return message.quote("⚠️ Certifique-se de que seu ID de compra é adequado!");
                    }

                    let CostofProperty = parseInt(Game.bases[Bases[BuyOption]].value);
                    if (UserBalance < CostofProperty) {
                        return message.reply("⚠️ Certifique-se de que tem dinheiro suficiente para comprar o imóvel!")
                    }
                    
                    let ya = await db.get(`${message.author.id}_base`)
                    
                    if (BuyOption === ya) {
                      return message.channel.send({
                        embed: {
                          title: "Erro",
                          description: "Você já comprou está base. compre outra!",
                          color: "RED"
                        }
                      })
                    }

                    let BaseDefense = Game.bases[Bases[BuyOption]].basestats.defend;
                    let BaseLuck = Game.bases[Bases[BuyOption]].basestats.luck;

                    await db.subtract(`${message.author.id}_balance`, CostofProperty);
                    await db.set(`${message.author.id}_base`, BuyOption);

                    await db.set(`${message.author.id}_basedefense`, BaseDefense);
                    await db.set(`${message.author.id}_baseluck`, BaseLuck);

                    return message.channel.send({
                        embed: {
                            title: "item Comprado",
                            description: `Você comprou **${Game.bases[Bases[BuyOption]].lebel}**! Use **${ServerPrefix}uprades** para fazer aprimoramentos!`,
                            color: "#ff0000",
                            footer: {
                                text: "Pedido por " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }
                else {
                    let BuyEmbed = new Discord.MessageEmbed()
                        .setTitle(`Bases / Propiedades`)
                        .setColor("GREEN")
                    .setDescription(`⚠️ Você só pode comprar outra coisa depois de comprar uma base **${ServerPrefix}base buy**. depois de fazer isso, você pode fazer upgrades. **${ServerPrefix}upgrades**.`)
                        .setFooter(`Use: ${ServerPrefix}base para ver sua base atual`);

                    for (let i = 0; i < Bases.length; i++) {
                        let Catergory = `**${i + 1}) ${Game.bases[Bases[i]].lebel}**`;
                        let Description = `${Game.bases[Bases[i]].description}\n\n`;

                        Description += `**Preço:** ${Util.moneyFormat(Game.bases[Bases[i]].value)}\n`;
                        Description += `**Upgrade Maximo:** ${Game.bases[Bases[i]].maxupgrade}\n\n`;

                        Description += `**Item Status:**\n`;
                        Description += `**Defesa:**         ${Game.bases[Bases[i]].basestats.defend}\n`;
                        Description += `**Sorte:**           ${Game.bases[Bases[i]].basestats.luck}\n`;

                        BuyEmbed.addField(Catergory, Description, true);
                    }

                    return message.channel.send(BuyEmbed);
                }
            }
            else if (CurrentBase > -1) {
                let BaseEmbed = new Discord.MessageEmbed()
                    .setTitle(`Sua Base`)
                    .setColor("RED")
                    .setDescription(`⚠️ Você só pode comprar outra coisa depois de comprar uma base **${ServerPrefix}base buy**. depois de fazer isso, você pode fazer upgrades. **${ServerPrefix}upgrades**.`)
                    .setFooter("Pedido por " + message.author.tag);

                let UserBase = await db.get(`${message.author.id}_base`);

                BaseEmbed.addField(`Nome`, `${Game.bases[Bases[UserBase]].lebel}`, true);
                BaseEmbed.addField(`Preço`, `${Util.moneyFormat(Game.bases[Bases[UserBase]].value)}`, true);
                BaseEmbed.addField(`Upgrade Maximo`, `${Game.bases[Bases[UserBase]].maxupgrade}`, true);

                let AddDenfese = await db.get(`${message.author.id}_defense`);
                let AddLuck = await db.get(`${message.author.id}_luck`);

                let CurrentStats = "";
                CurrentStats = `${Game.bases[Bases[UserBase]].basestats.defend} (+${AddDenfese})\n`;
                BaseEmbed.addField(`**Defesa:**`, CurrentStats, true);

                CurrentStats = `${Game.bases[Bases[UserBase]].basestats.luck} (+${AddLuck})\n`;
                BaseEmbed.addField(`**Sorte:**`, CurrentStats, true);

                let MoneyPrinter = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk1`));
                let MoneyPrinter2 = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk2`));
                let MoneyPrinter3 = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk3`));
              
                let MoneyPrinterUpgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk1'].upgrade);
                let MoneyPrinter2Upgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk2'].upgrade);
                let MoneyPrinter3Upgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk3'].upgrade);
              
                MoneyPrinter = MoneyPrinter * MoneyPrinterUpgrade;
                MoneyPrinter2 = MoneyPrinter2 * MoneyPrinter2Upgrade;
                MoneyPrinter3 = MoneyPrinter3 * MoneyPrinter3Upgrade;

                CurrentStats = `${Util.moneyFormat(MoneyPrinter + MoneyPrinter2 + MoneyPrinter3)}\n`;
                BaseEmbed.addField(`**Gerador de Dinheiro:**`, CurrentStats, true);

                return message.channel.send(BaseEmbed);
            }
            else {
                let BuyEmbed = new Discord.MessageEmbed()
                    .setTitle(`Bases / Propiedades`)
                    .setColor("RED")
                    .setDescription(`⚠️ Você pode comprar uma propiedade usando **${ServerPrefix}base buy [id]**. depois de fazer isso, você pode fazer upgrades usando **${ServerPrefix}upgrades**.`)
                    .setFooter(`Use: ${ServerPrefix}base para ver sua base`);

                for (let i = 0; i < Bases.length; i++) {
                    let Catergory = `**${i + 1}) ${Game.bases[Bases[i]].lebel}**`;
                    let Description = `${Game.bases[Bases[i]].description}\n\n`;

                    Description += `**Preço:** ${Util.moneyFormat(Game.bases[Bases[i]].value)}\n`;
                    Description += `**Upgrade Maximo:** ${Game.bases[Bases[i]].maxupgrade}\n\n`;

                    Description += `**Status da Base:**\n`;
                    Description += `Defesa:  ${Game.bases[Bases[i]].basestats.defend}\n`;
                    Description += `Sorte:    ${Game.bases[Bases[i]].basestats.luck}\n`;

                    BuyEmbed.addField(Catergory, Description, true);
                }

                return message.channel.send(BuyEmbed);
            }
        }
        catch (err) {
            console.log(err);
            return message.reply(`❌ Ocorreu um erro contate o dono.`);
        }
    }
};