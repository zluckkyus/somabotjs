const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
        name: "captcha",
        noalias: [''],
        args: 0,
        category: "🖼 Imagens",
        description: "mostra o captcha com o avatar do usuario",
        usage: "[username | nick | menção | ID]",
        accessableby: "everyone",
    async execute(message, args, client) {
        message.channel.startTyping(1)
        message.channel.stopTyping(true)
        let user = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
        let m = await message.channel.send("**Espere um pouco...**");
        try {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=captcha&username=${user.user.username}&url=${user.user.displayAvatarURL({ format: "png", size: 512 })}`));
            let json = await res.json();
            let attachment = new Discord.MessageAttachment(json.message, "captcha.png");
            message.channel.send(attachment);
            message.channel.stopTyping()
            m.edit("🖼 Pronto!")
            m.delete({ timeout: 5000 });
        } catch (e) {
            console.log(e);
            m.edit("😥 Foi mal! houve um erro ao executar o comando, tente novamente!");
        }
    }
};