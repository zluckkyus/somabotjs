const Discord = require('discord.js');

module.exports = {
	name: 'avatar',
	category: '🍦 Utilidades',
	description: 'Veja o avatar do usuario',
	aliases: ['av'],
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

		let avatar = user.user.displayAvatarURL({ dynamic: true, size: 4096 });

		let em = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle(`📸 ${user.user.username}`)
			.setDescription(`**Que belo avatar! [Baixar](${avatar}) **`)
			.setImage(avatar);

		message.channel.send(em);
	}
};
