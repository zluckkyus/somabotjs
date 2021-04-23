const Discord = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
        name: "tweet",
        args: 1,
        category: "🖼 Imagens",
        description: "Envia um tweet",
        usage: "[username] <txt>",
        accessableby: "everyone",
    async execute(message, args, client) {

        let user = args[0];
        let text = args.slice(1).join(" ");

        let m = await message.channel.send("🐦 **Espere um pouco...**");

        if(!user){
            return m.edit("**Coloque o nick de alguem, do twitter!**");
        }

        if(!text){
            return m.edit("**Coloque uma mensagem!**");
        }

        try {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${text}`));
            let json = await res.json();
            let attachment = new Discord.MessageAttachment(json.message, "tweet.png");
            await message.channel.send(`**Novo tweet publicado por ${user}**`, attachment);
            m.delete({ timeout: 5000});
        } catch(e){
            m.edit("⚠️ Tente novamente mencione alguem.");
        }
    }
};