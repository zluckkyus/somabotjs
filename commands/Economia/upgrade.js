const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')
const Discord = require('discord.js');
const fs = require('fs');

let rawdata = fs.readFileSync('./include/assets/json/game.json');
let Game = JSON.parse(rawdata);

module.exports = {
    name: 'upgrade',
    description: "Compre ou veja upgrades para sua base!",
    aliases: ['upgrades'],
    usage: ' [buy/view] [opções]',
    cooldown: 2,
    args: 0,
    category: '💰 Economia',
    async execute(message, args, client) {
        try {
            let Options = args[0];
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`)
            let CurrentBase = await db.get(`${message.author.id}_base`);

            let Upgrades = Game.data["Upgrades"];
            let Bases = Game.data["Bases"];

            let CurrentUpgrade = [];
            for (let i = 0; i < Upgrades.length; i++) {
                CurrentUpgrade.push(Util.NotNumberCheck(await db.get(`${message.author.id}_${Upgrades[i]}`))); 
            }

            if (CurrentBase > -1) {
                if (Options == "buy") {
                    let BuyOption = args[1];
                    if (!isNaN(BuyOption)) {
                        let UserBalance = await db.get(`${message.author.id}_balance`);
                        BuyOption -= 1;

                        if ((BuyOption + 1) < 1 || (BuyOption + 1) > Upgrades.length) {
                            return message.reply("⚠️ Certifique-se de que seu ID de compra é adequado!");
                        }

                        let TotalUpgrade = await db.get(`${message.author.id}_${Upgrades[BuyOption]}`);
                        let MaxUpgrade = await db.get(`${message.author.id}_base`);
                        MaxUpgrade = Game.bases[Bases[MaxUpgrade]].maxupgrade;

                        if (TotalUpgrade >= MaxUpgrade) {
                            return message.reply("⚠️ Você não pode fazer upgrade mais do que sua base atual pode suportar!");
                        }

                        let CostofUpgrade = (Game.upgrades[Upgrades[BuyOption]].value * (CurrentUpgrade[BuyOption] + 1));
                        if (UserBalance < CostofUpgrade) {
                            return message.reply("⚠️ Certifique-se de ter dinheiro suficiente para comprar o upgrade!")
                        }


                        db.subtract(`${message.author.id}_balance`, CostofUpgrade);

                        if (Upgrades[BuyOption] == "turret" || Upgrades[BuyOption] == "fireturret" || Upgrades[BuyOption] == "lazerturret") {
                            let Upgrade = Util.NotNumberCheck(Game.upgrades[Upgrades[BuyOption]].upgrade);
                            db.add(`${message.author.id}_defense`, Upgrade);
                        }

                        if (Upgrades[BuyOption] == "incense" || Upgrades[BuyOption] == "chamomile") {
                            let Upgrade = Util.NotNumberCheck(Game.upgrades[Upgrades[BuyOption]].upgrade);
                            db.add(`${message.author.id}_luck`, Upgrade);
                        }

                        db.add(`${message.author.id}_${Upgrades[BuyOption]}`, 1);

                        return message.channel.send({
                            embed: {
                                title: "Upgrade",
                                description: `Você comprou **${Game.upgrades[Upgrades[BuyOption]].lebel}**! Porfavor use **${ServerPrefix}uprades** para atualizar sua base ainda mais ou **${ServerPrefix}base** para ver suas estatísticas!`,
                                color: "GREEN",
                                timestamp: new Date()
                            }
                        });
                    }
                    else {
                        let BuyEmbed = new Discord.MessageEmbed()
                            .setTitle(`Base Upgrades`)
                            .setColor("#8B0000")
                            .setDescription(`Você pode comprar um upgrade fazendo **${ServerPrefix}upgrade buy [id]**`)
                            .setFooter(`Please do ${ServerPrefix}base to see your current base`);

                        for (let i = 0; i < Upgrades.length; i++) {
                            let Catergory = `**${i + 1}) ${Game.upgrades[Upgrades[i]].lebel} (${CurrentUpgrade[i]})**`;
                            let Description = `${Game.upgrades[Upgrades[i]].description}\n\n`;

                            let Cost = Game.upgrades[Upgrades[i]].value;
                            Cost = Cost * (CurrentUpgrade[i] + 1);

                            Description += `**Preço:** ${Util.moneyFormat(Cost)}\n`;
                            Description += `**Upgrade:** +${Game.upgrades[Upgrades[i]].upgrade}\n`;

                            BuyEmbed.addField(Catergory, Description, true);
                        }

                        return message.channel.send(BuyEmbed);
                    }
                }
                else {
                    let BuyEmbed = new Discord.MessageEmbed()
                        .setTitle(`Base Upgrades`)
                        .setColor("#8B0000")
                        .setDescription(`Você pode comprar uma atualização fazendo **${ServerPrefix}upgrade buy [id]**`)
                        .setFooter(`Use: ${ServerPrefix}base para ver o status`);

                    for (let i = 0; i < Upgrades.length; i++) {
                        let Catergory = `**${i + 1}) ${Game.upgrades[Upgrades[i]].lebel} (${CurrentUpgrade[i]})**`;
                        let Description = `${Game.upgrades[Upgrades[i]].description}\n\n`;

                        let Cost = Game.upgrades[Upgrades[i]].value;
                        Cost = Cost * (CurrentUpgrade[i] + 1);

                        Description += `**Preço:** ${Util.moneyFormat(Cost)}\n`;
                        Description += `**Upgrade:** +${Game.upgrades[Upgrades[i]].upgrade}\n`;

                        BuyEmbed.addField(Catergory, Description, true);
                    }

                    return message.channel.send(BuyEmbed);
                }
            }
            else {
                message.reply(`Por favor, compre uma propriedade fazendo **${ServerPrefix}base buy** antes de fazer atualizações em sua base`);
            }
        }
        catch (err) {
            console.log(err);
            return message.reply(`Houve um erro, contate o dono.`);
        }
    }
};
