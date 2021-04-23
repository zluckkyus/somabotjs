const { MessageEmbed } = require("discord.js")

module.exports = {
        name: "serverinfo",
        args: 0,
        category: "🍦 Utilidades",
        description: "Mostra as informações da guilda",
        aliases: ["sinfo"],
    async execute(message, args, client) {
		
		const online = message.guild.members.cache.filter(m =>
  			m.presence.status === 'online'
			).size

		const idle = message.guild.members.cache.filter(m =>
  			m.presence.status === 'idle'
			).size

		const offline = message.guild.members.cache.filter(m =>
  			m.presence.status === 'offline'
			).size
		
		const dnd = message.guild.members.cache.filter(m =>
  			m.presence.status === 'dnd'
			).size

		const text = message.guild.channels.cache.filter(r => r.type === "text").size
		const voice = message.guild.channels.cache.filter(r => r.type === "voice").size
		const chs = message.guild.channels.cache.size
		
		const roles = message.guild.roles.cache.size
		
        let owner = [];
        await client.users.fetch(message.guild.ownerID).then(o => owner.push(o.tag))
        try {
            let embed = new MessageEmbed()
                .setColor("#303136")
                .setThumbnail(message.guild.iconURL())
                .setAuthor(`${message.guild.name} Info`, message.guild.iconURL())
                .addField(":crown: Dono", `${owner}`, false)
                .addField(":id: Server ID", `${message.guild.id}`)
                .addField(":calendar: Criado", message.guild.createdAt.toLocaleString(), false)
                .addField(`:speech_balloon: Canais **(${chs})**`, ` **${text}** Texto \n **${voice}** Voz`, false)
                .addField(`:busts_in_silhouette: Membros (${message.guild.memberCount})**`, `**${online}** Online \n **${idle}** Idle \n **${dnd}** Dnd \n**${offline}** Offline \n **${message.guild.premiumSubscriptionCount}** Boosts`, false)
				.setTimestamp()
      			.setFooter(`Pedido por: ${message.author.username}`, message.author.avatarURL);
            message.quote(embed);
        }
       catch {
            return message.channel.send('Aconteceu alguma coisa!')
        }
    }
}