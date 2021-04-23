const { MessageEmbed } = require('discord.js');
const moment = require("moment")

moment.locale("pt-br")

module.exports = {
        name: "userinfo",
		aliases: ['user'],
        category: "🍦 Utilidades",
		description: "Mostra as informações do usuarios.",
		args: 0,
    async execute(message, args, client) {
        let user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        r =>
          r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
      ) ||
      message.guild.members.cache.find(
        r => r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
      ) ||
      message.member;

        let status;
        switch (user.user.presence.status) {
            case "online":
                status = "online";
                break;
            case "dnd":
                status = "dnd";
                break;
            case "idle":
                status = "idle";
                break;
            case "offline":
                status = "offline";
                break;
        }

        const embed = new MessageEmbed()
            .setTitle(`<:discord:824762042925449256> ️ ${user.user.username}`)
            .setColor(`#ff0000`)
            .setThumbnail(user.user.displayAvatarURL({dynamic : true}))
            .addFields(
                {
                    name: "🧙‍♂️ Nome: ",
                    value: user.user.username,
                    inline: true
                },
                {
                    name: "📃 Discriminador: ",
                    value: `#${user.user.discriminator}`,
                    inline: true
                },
                {
                    name: "🔖 ID: ",
                    value: user.user.id,
                },
                {
                    name: "🌟 Status Atual: ",
                    value: status,
                    inline: true
                },
                {
                    name: "🎮 Atividade: ",
                    value: user.presence.activities[0] ? user.presence.activities[0].name : `Este usuario não está jogando!`,
                    inline: true
                },
                {
                    name: '🖼 Avatar: ',
                    value: `[Clique aqui](${user.user.displayAvatarURL()})`
                },
                {
                    name: '🕝 Data de Criação: ',
                    value: moment.utc(user.user.createdAt).format('LLLL'),
                    inline: true
                },
                {
                    name: '🕣 Data de Entrada: ',
                    value: moment.utc(user.joinedAt).format('LLLL'),
                    inline: true
                },
                {
                    name: '🎲 Cargos: ',
                    value: user.roles.cache.map(role => role.toString()).join(" ,"),
                    inline: true
                }
            )

        await message.channel.send(embed)
    }
}