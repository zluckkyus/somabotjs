const Util = require('../../util/MitUtil.js');
const MiniGames = require('../../util/MiniGames.js');
const db = require('../../util/Database.js')
const fs = require('fs');
const Discord = require('discord.js');
const ownerid = '790785456773136384'

let rawdata = fs.readFileSync('./include/assets/json/jobs.json');
let Game = JSON.parse(rawdata);

module.exports = {
    name: 'work',
    description: "Trabalhe e ganhe um dinheiro.",
    aliases: ['wk', 'job'],
    usage: ' [get/view] [jobid/page]',
    cooldown: 5,
    args: 0,
    category: '💰 Economia',
    async execute(message, args, client) {
        try {
            let timeout = 86400000;
            let timeout2 = 3600000;

            let CurrentTimeStamp = new Date().getTime();
            let JobArray = Game["data"];

            let UserJob = await db.get(`${message.author.id}_job`);
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`)

            let UserTimeStamp = await db.get(`${message.author.id}_jobclock`);
            if (UserJob > -1 && !args[0]) {
                if (((CurrentTimeStamp - UserTimeStamp) > timeout) && (UserTimeStamp > 0)) {
                    await db.set(`${message.author.id}_job`, -1);
                    await db.set(`${message.author.id}_promotion`, 0);
                    return message.channel.send({
                        embed: {
                            title: "Demitido",
                            description: `Você foi demitido de seu emprego! Não se esqueça de trabalhar todo dia para não ser demitido!`,
                            color: "#ff0000",
                            footer: {
                                text: "Pedido por" + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }

                if (((CurrentTimeStamp - UserTimeStamp) < timeout2) && (UserTimeStamp > 0)) {
                    const timeLeft = timeout2 - (CurrentTimeStamp - UserTimeStamp);
                    return message.channel.send({
                        embed: {
                            title: "Cooldown Trabalho",
                            description: `Volte depois para trabalhar novamente, mas não se esqueça de trabalhar **${Util.msToTime(timeLeft)}**!`,
                            color: "#ff0000",
                            footer: {
                                text: "Pedido por " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }

               
                await db.set(`${message.author.id}_jobclock`, CurrentTimeStamp);
                MiniGames.minigames(message);
            }
            else {
                let Option = "view";
                let OptionNumber = 1;

                if (args[0] == "get") {
                    Option = "get";
                }

                if (args[1]) {
                    if (isNaN(args[1])) {
                        return message.reply(`Use o comando corretamemte, \`\`${ServerPrefix}work [get/view] [jobid/page]\`\``)
                    }
                    OptionNumber = Util.NotNumberCheck(args[1]);
                }
                else if (args[0]) {
                    if (!isNaN(args[0])) {
                        OptionNumber = Util.NotNumberCheck(args[0]);
                    }
                }

                
                if (Option == "view") {
                    let ViewEmbed = new Discord.MessageEmbed()
                        .setTitle(`Jobs`)
                        .setColor("#ff0000")
                        .setDescription(`Você pode iniciar seu trabalho usando **${ServerPrefix}work [get] [id]** ou para mudar a pagina use **${ServerPrefix}work [view] [page]**`)
                        .setFooter(`Proxima Pagina: ${ServerPrefix}work view ${OptionNumber + 1}`);

                    let Start = 6 * (OptionNumber - 1);
                    let End = Start + 6;
                    if (End > JobArray.length) {
                        End = JobArray.length;
                    }


                    for (let i = Start; i < End; i++) {
                        let Catergory = `**${i + 1}) ${Game.jobs[JobArray[i]].lebel}**`;
                        let Description = `${Game.jobs[JobArray[i]].description}\n\n`;

                        Description += `**Level Minimo:** ${Game.jobs[JobArray[i]].level}\n`;
                        Description += `**Ganhos:** ${Util.moneyFormat(Game.jobs[JobArray[i]].earnings)}\n`;
                        Description += `**Bonus Maximo:** ${Util.moneyFormat(Game.jobs[JobArray[i]].bonus)}\n\n`;

                        Description += `**Promoção Maxima:** ${Game.jobs[JobArray[i]].maxpromotion}\n`;
                        Description += `**Risco:** ${Game.jobs[JobArray[i]].risk}\n\n`;

                        ViewEmbed.addField(Catergory, Description, true);
                    }

                    return message.channel.send(ViewEmbed);
                }
                else {
                    let Level = await db.get(`${message.author.id}_level`);
                    OptionNumber -= 1;

                    if (OptionNumber > JobArray.length || OptionNumber < 0) {
                        return message.channel.send({
                            embed: {
                                title: "Recusado",
                                description: `Não encontrei o emprego que você procura! Verifique se o **ID** está correto, nós temos ${JobArray.length} empregos.`,
                                color: "#ff0000",
                                footer: {
                                    text: "Pedido por " + message.author.tag,
                                    icon_url: message.author.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        });
                    }

                    if (Level < Game.jobs[JobArray[OptionNumber]].level) {
                        return message.channel.send({
                            embed: {
                                title: "Recusado",
                                description: `Devido ao seu nível não atender aos requisitos de nível mínimo do trabalho, você foi rejeitado!`,
                                color: "#ff0000",
                                footer: {
                                    text: "Pedido por " + message.author.tag,
                                    icon_url: message.author.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        });
                    }
                    let trb = db.get(`${message.author.id}_job`)
                    if (OptionNumber === UserJob) {
                      return message.channel.send("esse já é seu trabalho")
                    }
                    

                    await db.set(`${message.author.id}_job`, OptionNumber);
                    await db.set(`${message.author.id}_jobclock`, 0);
                    await db.set(`${message.author.id}_promotion`, 0);
                    return message.channel.send({
                        embed: {
                            title: "Contratado!",
                            description: `Você tem os requisitos certos, você foi aceito em ${Game.jobs[JobArray[OptionNumber]].lebel}! para começar a trabalhar **${ServerPrefix}work**. Lembre-se de trabalhar diariamente, para não ser demitido!`,
                            color: "#008000",
                            footer: {
                                text: "Pedido por " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }
            }

        } catch (e) {
            console.error(e)
            message.reply("❌ Ocorreu algum erro, tente novamente mais tarde.")
        }
    }
};
