const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')
const Discord = require('discord.js');
const fs = require('fs');

const words = ['click', 'shoot', 'beep', 'bip', 'atirar','tirar'];

module.exports = {
    name: 'camera',
    description: "Tire fotos, e venda para ganhar dinheiro",
    aliases: ['photo', 'cam'],
    usage: '',
    cooldown: 30,
    args: 0,
    category: '💰 Economia',
    async execute(message, args, client) {
        try {
            let ServerPrefix = await db.get(`prefix_${message.guild.id}`)
            let Camera = Util.NotNumberCheck(await db.get(`${message.author.id}_camera`));

            if (Camera > 0) {
                message.channel.send({
                    embed: {
                        title: "Prepare se...",
                        description: `*Você prepara sua camera.....*`,
                        color: "ORANGE",
                        timestamp: new Date()
                    }
                });

                await Util.delay(Util.getRandomInt(1000, 10000));
                const word = words[Math.floor(Math.random() * words.length)];

                let Luck = Util.NotNumberCheck(await db.get(`${message.author.id}_luck`));
                Luck += Util.NotNumberCheck(await db.get(`${message.author.id}_baseluck`));

                message.channel.send({
                    embed: {
                        title: "AGORA!",
                        description: `DIGITE \`${word.toUpperCase()}\` AGORA!`,
                        color: "RANDOM",
                        timestamp: new Date()
                    }
                }).then(() => {
                    message.channel.awaitMessages(response => response.author.id == message.author.id, {
                        max: 1,
                        time: 5000,
                        errors: ['time'],
                    }).then((collected) => {
                        let Reward = Math.round(Math.random() * 1500);
    
                        if (Luck > 0) {
                            Luck = (Reward / 100) * Luck;
                        }
    
                        Reward += Luck;
                        if (isNaN(collected.first().content)) {
                            if (collected.first().content.toLowerCase() == word) {
                                db.add(`${message.author.id}_balance`, Math.round(Reward));
                                return message.channel.send({
                                    embed: {
                                        title: "Otima Foto",
                                        description: `Você tirou uma boa foto, e conseguiu vender por **${Util.moneyFormat(Reward - Luck)} +(${Util.moneyFormat(Luck)})**`,
                                        color: "#228B22",
                                        timestamp: new Date()
                                    }
                                });
                            }
                        }
    
                        return message.channel.send({
                            embed: {
                                title: "Sinto Muito",
                                description: `*Opss* Você errou a foto, sinto muito tente novamente mais tarde!`,
                                color: "#8B0000",
                                timestamp: new Date()
                            }
                        });
    
                    }).catch((err) => {
                        return message.quote('🚨 Você foi lento, então perdeu o momento');
                    });
                });
            }
            else {
                return message.reply(`⚠️ Compre uma camera em **${ServerPrefix}shop**, para poder tirar fotos!!`);
            }
        }
        catch (err) {
            console.log(err);
            return message.reply(`Ocorreu um erro, chame o dono.`);
        }
    }
};