const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js')
const Discord = require('discord.js');
const fs = require("fs");
const { ownerid } = require('../../config.json');

let EmoteArray = [":first_place:", ":second_place:", ":third_place:", ":military_medal:", ":military_medal:", ":military_medal:", ":military_medal:", ":military_medal:", ":military_medal:", ":military_medal:", ":military_medal:"];
module.exports = {
    name: 'leaderboard',
    description: "Mostra os usuarios mais ricos",
    aliases: ['rich', 'lb'],
    usage: '',
    cooldown: 10,
    args: 0,
    category: '💰 Economia',
    async execute(message, args, client) {
        try {
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`)
            
                    let money = db.get().filter(data => data.ID.endsWith(`_balance`)).sort((a, b) => b.data - a.data);
        if (!money.length) {
            let noEmbed = new MessageEmbed()
                .setAuthor(message.member.displayName, message.author.displayAvatarURL())
                .setColor("GREEN")
                .setFooter("Ninguem deve ter dinheiro!")
            return message.channel.send(noEmbed)
        };

        money.length = 10;
        var finalLb = "";
        for (var i in money) {
            if (money[i].data === null) money[i].data = 0
            finalLb += `**${money.indexOf(money[i]) + 1}. ${bot.users.cache.get(money[i].ID.split('_')[1]) ? bot.users.cache.get(money[i].ID.split('_')[1]).tag : "Usuario Descconhecido#0000"}** - ${money[i].data} :dollar:\n`;
        };

        const embed = new MessageEmbed()
            .setTitle(`Leaderboard`)
            .setColor("GREEN")
            .setDescription(finalLb)
            .setFooter(bot.user.tag, bot.user.displayAvatarURL())
            .setTimestamp()
        message.channel.send(embed);
    } catch(err) {
        message.channel.send("Ocorreu algum erro")
    }
  }
  }