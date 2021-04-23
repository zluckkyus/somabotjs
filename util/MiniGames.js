const fs = require('fs');
const Util = require('./MitUtil.js');
const db = require('./Database.js')

const { createCanvas, registerFont } = require('canvas');

var randomWords = require('random-words');
var rAnimal = require("random-animal-name");

async function MiniGames(message) {
    try {
        let rawdata = fs.readFileSync('./include/assets/json/jobs.json');
        let Game = JSON.parse(rawdata);
        let JobArray = Game["data"];

        let UserJob = await db.get(`${message.author.id}_job`);
        let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
        Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

        let Reward = Math.round(Math.random() * Game.jobs[JobArray[UserJob]].earnings) + 1;
        let Bonus = Math.round(Math.random() * Game.jobs[JobArray[UserJob]].bonus) + 1;

        let Promotion = await db.get(`${message.author.id}_promotion`);
        if (Promotion > 0) {
            Reward += (Reward / 100) * (Promotion * 15);
        }

        if (Luck > 0) {
            Luck = (Reward / 100) * Luck;
            Reward += Luck;
        }

        if (Promotion < Game.jobs[JobArray[UserJob]].maxpromotion) {
            let PromotionRan = Math.round(Math.random() * (10 * Promotion));
            if (PromotionRan < 3) {
                await db.add(`${message.author.id}_promotion`, 1);
                await message.channel.send({
                    embed: {
                        title: "Promovido!",
                        description: `Depois de trabalhar por algum tempo, seu chefe decidiu te dar uma **promoção**, aproveite o aumento!!`,
                        color: "RANDOM",
                        footer: {
                            text: "Promoção de" + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
            }
        }

        let Words = randomWords({ exactly: 5 });
        let MiniGame = Math.round(Math.random() * 3);
        switch (MiniGame) {
            case 0:
                registerFont("./include/assets/fonts/Captcha.ttf", { family: 'Captcha' });
                const canvas = createCanvas(125, 32);
                const ctx = canvas.getContext('2d');
                const text = Util.makeid(5);
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.strokeStyle = '#0088cc';
                ctx.font = '26px Captcha';
                ctx.rotate(-0.05);
                ctx.strokeText(text, 15, 26);
                await message.channel.send({
                    embed: {
                        title: "Captcha",
                        description: `Por favor, tente resolver o captcha que aparece abaixo desta mensagem`,
                        color: "#8B0000",
                        image: {
                            url: 'attachment://captcha-quiz.png',
                        },
                        timestamp: new Date()
                    },
                    files: [{
                        attachment: canvas.toBuffer(),
                        name: 'captcha-quiz.png'
                    }]
                });

                const msgs = await message.channel.awaitMessages(res => res.author.id === message.author.id, {
                    max: 1,
                    time: 15000
                });

                if (!msgs.size) {
                    return message.channel.send({
                        embed: {
                            title: "Falhou no Trabalho",
                            description: `Você **não** conseguiu resolver o captcha ** a tempo **, melhor sorte da próxima vez!`,
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }

                if (msgs.first().content !== text) {
                    return message.channel.send({
                        embed: {
                            title: "Falhou no Trabalho",
                            description: `Você não conseguiu obter a resposta certa! A resposta certa foi **${text}**, melhor sorte da próxima vez!`,
                            color: "#8B0000",
                            footer: {
                                text: "Falha de" + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }

                let Chances = Math.round(Math.random() * 3);
                let Message = ``;
                switch (Chances) {
                    case 1:
                        await db.add(`${message.author.id}_balance`, Reward);
                        await db.add(`${message.author.id}_balance`, Bonus);
                        Message = `Você completou seu trabalho e conseguiu ganhar **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** durante uma hora, o seu chefe também ficou feliz com seu trabalho e lhe deu um bônus de **${Util.moneyFormat(Bonus)}**`;
                        break;
                    case 2:
                        await db.add(`${message.author.id}_balance`, Reward);
                        await db.add(`${message.author.id}_experience`, Bonus);
                        Message = `Você completou seu trabalho e conseguiu ganhar **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** durante uma hora, o seu chefe também ficou feliz com seu trabalho e lhe deu um bônus de **${Util.moneyFormatW(Bonus)}** Experiência`;
                        break;
                    default:
                        await db.add(`${message.author.id}_balance`, Reward);
                        Message = `Você completou seu trabalho e ganhou **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                        break;
                }

                return message.channel.send({
                    embed: {
                        title: `Trabalho Completo`,
                        description: Message,
                        color: "RANDOM",
                        footer: {
                            text: "Trabalho de " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
                break;
            case 1:
                let ShownEmojis = Game.datajob["rememberemojis"];
                ShownEmojis = Util.shuffle(ShownEmojis);

                let TitleMessage1 = `Por favor, memorize as palavras ao lado dos emotes e os emtoes abaixo desta mensagem\n\n`;
                for (let i = 0; i < 3; i++) {
                    TitleMessage1 += `${ShownEmojis[i]} - \`${Words[i]}\`\n`;
                }

                let OriginalMessage = await message.channel.send({
                    embed: {
                        title: `Trabalho - ${Util.firstUpperCase(JobArray[UserJob])}`,
                        description: TitleMessage1,
                        color: "RANDOM",
                        footer: {
                            text: "Pedido Por " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });

                await Util.delay(5000);

                let RandomRange = Math.round(Math.random() * 2);
                await OriginalMessage.edit({
                    embed: {
                        title: `Trabalho - ${Util.firstUpperCase(JobArray[UserJob])}`,
                        description: `Que palavra apareceu depois ${ShownEmojis[RandomRange]}`,
                        color: "#8B0000",
                        timestamp: new Date()
                    }
                });

                await message.channel.awaitMessages(response => (response.author.id == message.author.id), {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then(async (collected) => {
                    let Message = collected.first().content.toLowerCase();
                    if (Message == Words[RandomRange]) {
                        let Chances = Math.round(Math.random() * 3);
                        let Message = ``;
                        switch (Chances) {
                            case 1:
                                await db.add(`${message.author.id}_balance`, Reward);
                                await db.add(`${message.author.id}_balance`, Bonus);
                                Message = `Você completou seu trabalho e conseguiu ganhar **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** durante uma hora, o seu chefe também ficou feliz com seu trabalho e lhe deu um bônus de **${Util.moneyFormat(Bonus)}**`;
                                break;
                            case 2:
                                await db.add(`${message.author.id}_balance`, Reward);
                                await db.add(`${message.author.id}_experience`, Bonus);
                                Message = `Você conseguiu completar seu trabalho e ganhou **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** durante a hora, o chefe também ficou feliz com seu trabalho e lhe deu um bônus de **${Util.moneyFormatW(Bonus)}** experience`;
                                break;
                            default:
                                await db.add(`${message.author.id}_balance`, Reward);
                                Message = `Você completou seu trabalho e ganhou **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                                break;
                        }

                        return message.channel.send({
                            embed: {
                                title: `Trabalho Completo`,
                                description: Message,
                                color: "#008000",
                                timestamp: new Date()
                            }
                        });
                    }
                    else {
                        return message.channel.send({
                            embed: {
                                title: `Falha`,
                                description: `**Errado**, A Resposta correta é **${Words[RandomRange]}**`,
                                color: "RED",
                                footer: {
                                    text: "Falha de " + message.author.tag,
                                    icon_url: message.author.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        });
                    }

                }).catch((err) => {
                    return message.channel.send({
                        embed: {
                            title: `Falha`,
                            description: `Certifique-se de resolver o quebra-cabeça da próxima vez!`,
                            color: "ORANGE",
                            timestamp: new Date()
                        }
                    });
                });

                break;
            default:
                let TitleMessage = `**desembaralhe qualquer** das palavras fornecidas que aparecem abaixo desta mensagem\n\n`;
                for (let i = 0; i < Words.length; i++) {
                    TitleMessage += `\`${Util.shuffleWord(Words[i])}\` `;
                }

                await message.channel.send({
                    embed: {
                        title: `Trabalho - ${Util.firstUpperCase(JobArray[UserJob])}`,
                        description: TitleMessage,
                        color: "#8B0000",
                        timestamp: new Date()
                    }
                });

                await message.channel.awaitMessages(response => (response.author.id == message.author.id) && (Util.wordArray(Words, response.content)), {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then(async (collected) => {
                    let Chances = Math.round(Math.random() * 3);
                    let Message = ``;
                    switch (Chances) {
                        case 1:
                            await db.add(`${message.author.id}_balance`, Reward);
                            await db.add(`${message.author.id}_balance`, Bonus);
                            Message = `Você completou seu trabalho e conseguiu ganhar **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** Durante uma hora de seu trabalho, o seu chefe viu como você trabalhou bem e lhe deu um bonus de **${Util.moneyFormat(Bonus)}**`;
                            break;
                        case 2:
                            await db.add(`${message.author.id}_balance`, Reward);
                            await db.add(`${message.author.id}_experience`, Bonus);
                            Message = `Você completou seu trabalho e conseguiu ganhar **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})** Durante uma hora de seu trabalho, o seu chefe viu como você trabalhou bem e lhe deu um bonus de **${Util.moneyFormatW(Bonus)}** Experiência`;
                            break;
                        default:
                            await db.add(`${message.author.id}_balance`, Reward);
                            Message = `Você completou seu trabalho e ganhou **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`;
                            break;
                    }

                    return message.channel.send({
                        embed: {
                            title: `Trabalho Completo`,
                            description: Message,
                            color: "GREEN",
                            footer: {
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }).catch((err) => {
                    return message.channel.send({
                        embed: {
                            title: `Falha`,
                            description: `Resolva o quebra cabeça na proxima vez!`,
                            color: "RES",
                            footer: {
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                });
                break;
        }


    } catch (e) {
        console.error(e)
        message.reply("Something went wrong! Please try again later!")
    }
}

module.exports.minigames = MiniGames;