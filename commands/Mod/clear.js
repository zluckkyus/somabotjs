const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = {
        name: "clear",
        args: 0,
        aliases: ["delete", "purge", 'prune'],
        category: "👮 Moderação",
        description: "Limpa as mensagens do canal",
        usage: "clear [quantidade]",
        accessableby: "Administrator",
    async execute(message, args, client) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("⚠️ Você não tem permissões - [GERÊNCIAR_MENSAGENS]")
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send("⚠️ Eu não tenho permissão para executar o comando - [GERÊNCIAR_MENSAGENS]")
        if (isNaN(args[0]))
            return message.channel.send('⚠️ **Peço que coloque um valor para eu deletar!**');

        if (args[0] > 100) return message.channel.send("⚠️ **O Valor precisa ser menos que 100!!**");

        if (args[0] < 1) return message.channel.send("⚠️ **O Valor precisa ser mais que 1!**");

        message.channel.bulkDelete(args[0])
            .then(messages => message.channel.send(`**🗑 Eu Deletei \`${messages.size}/${args[0]}\` Mensagens**`)
            .then(msg => msg.delete({ timeout: 10000 })))
            .catch(() => null)
			let channel = db.fetch(`modlog_${message.guild.id}`)
            if (channel == null) return;

            if (!channel) return;

            const embed = new MessageEmbed()
                .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
                .setColor("#ff0000")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setFooter(message.guild.name, message.guild.iconURL())
                .addField("Moderation", "Purge")
                .addField("Messages", `${args[0]}`)
                .addField("Channel ID", `${message.channel.id}`)
                .addField("Used by:", message.author.username)
                .addField("Date", message.createdAt.toLocaleString())
                .setTimestamp();

            var sChannel = message.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send(embed)
    }
}