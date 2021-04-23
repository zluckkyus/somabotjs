const { MessageEmbed } = require('discord.js');

module.exports = {
        name: "ping",
        description: "Mostra latência do usuario e bot",
        usage: " ",
        args: 0,
        noalias: "Sem Aliases",
        category: "🍦 Utilidades",
        accessableby: "everyone",
    async execute(message, args, client) {

        message.channel.send("🛰 **Verificando a Latência...**").then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp
            const embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`🛰 Latência: ${ping}\n\n🛸 Latência da api: ${Math.round(client.ws.ping)}`)
            message.channel.send(embed)
            m.delete()
        })
    }
};