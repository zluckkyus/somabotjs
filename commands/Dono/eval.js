const { MessageEmbed } = require('discord.js')
const db = require('../../util/Database.js')
const moment= require('moment')
const fetch = require('node-fetch')

module.exports = {
        name: "eval",
        hidden: true,
        args: 0,
        category: "✨ Especiais",
        description: "Evalua o comando",
        aliases: ["e"],
    async execute(message, args, client) {
        function clean(text) {
            if (typeof text === "string")
                return text
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
        let owner = ['777205185582727188']

        if (!owner.includes(message.author.id)) return;

        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

            message.react("✅");
            var emb = new MessageEmbed()
                .setTitle('Resultado')
                .setDescription(`\`\`\`js` + '\n' + clean(evaled) + `\n` + `\`\`\``)
                .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                .setColor(0xd26a0e)
            message.channel.send(emb);
        } catch (err) {
            message.react("⚠");
            var emb = new MessageEmbed()
                .setTitle('Resultado')
                .setDescription(`\`\`\`js` + '\n' + clean(err) + `\n` + `\`\`\``)
                .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
                .setColor(0xd26a0e)
            message.channel.send(emb);
        }
    }
}