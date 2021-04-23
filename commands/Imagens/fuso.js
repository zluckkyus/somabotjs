const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
        name: 'fusão',
        args: 1,
        aliases: ['fusao'],
        category: '🖼 Imagens',
        description: 'Fusãooooooo de avatar de usuarios',
        accessableby: 'everyone',
    async execute(message, args, client) {
        message.channel.startTyping(1)
        message.channel.stopTyping(true)
      
        if (!message.guild.me.hasPermission('ATTACH_FILES')) return message.channel.send("⚠️ **Faltando Permissões - [ATTACH_FILES]!**");
        if (!args[0]) return message.channel.send("**🤙 Qual usuario vai ser a base?**");
        if (!args[1]) return message.channel.send("**🤙 Oxi, qual vai ser o segundo avatar da base?**");
        let base = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName === args[0].toLocaleLowerCase());
        if (!base) return message.channel.send("⚠️ **Base do usuario não foi encontrado**");
        let overlay = message.mentions.members.first(2)[1] || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[1].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName === args[1].toLocaleLowerCase());
        if (!overlay) return message.channel.send("⚠️ **Overlay não encontrado(a)**");
        const baseAvatarURL = base.user.displayAvatarURL({ format: 'png', size: 512 });
        const overlayAvatarURL = overlay.user.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const baseAvatarData = await request.get(baseAvatarURL);
            const baseAvatar = await loadImage(baseAvatarData.body);
            const overlayAvatarData = await request.get(overlayAvatarURL);
            const overlayAvatar = await loadImage(overlayAvatarData.body);
            const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
            const ctx = canvas.getContext('2d');
            ctx.globalAlpha = 0.5;
            ctx.drawImage(baseAvatar, 0, 0);
            ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);
            return message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'avatarfusion.png' }] });
            message.channel.stopTyping()
        } catch (err) {
            return message.channel.send(`😎 Vejo que houve um erro veja: \`${err.message}\`. e tente novamente!`);
        };
    }
};