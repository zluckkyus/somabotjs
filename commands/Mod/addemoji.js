
const Discord = require("discord.js");
const { parse } = require("twemoji-parser");
const { MessageEmbed } = require("discord.js");
const Color = `RANDOM`;

module.exports = {
        name: "addemoji",
        args: 0,
        aliases: ["addmoji"],
        description: "Adicione um emoji ao servidor!",
        category: "👮 Moderação",
        usage: "<emoji/link>",
    async execute(message, args, client) {
       if (!message.member.hasPermission(`MANAGE_EMOJIS`)) {
      return message.channel.send(`🚫 **| Você não pode utilizar este comando, tenha a permissão \`GERÊNCIAR EMOJIS\` para utilizar este comando**`)
    }
       if (!message.guild.me.hasPermission("MANAGE_EMOJIS")) {
         return message.channel.send(`🚫 **| Eu não tenho permissão \`GERÊNCIAR EMOJIS\` para executar este comando**`)
       }
       let isUrl = require("is-url");
       let type = "";
       let name = "";
       let emote = args.join(" ").match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi);
       if (emote) {
         emote = emote[0];
         type = "emoji";
         name = args.join(" ").replace(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi, "").trim().split(" ")[0];
       } else  {
         emote = `${args.find(arg => isUrl(arg))}`
         name = args.find(arg => arg != emote);
         type = "url";
       }
       let emoji = { name: "" };
       let Link;
       if (type == "emoji") {
         emoji = Discord.Util.parseEmoji(emote);
         Link = `https://cdn.discordapp.com/emojis/${emoji.id}.${
         emoji.animated ? "gif" : "png"
           
         }`
       } else { 
         if (!name) return message.channel.send("⚠️ | Coloque algum nome para o emoji!");
         Link = message.attachments.first() ? message.attachments.first().url : emote;  }
            message.guild.emojis.create(
                `${Link}`,
                `${`${name || emoji.name}`}`
            ).then(em => message.channel.send(em.toString() + " | Emoji adicionado com sucesso!")).catch(error => {
              message.channel.send(":x: | Ocorreu algum erro.")
                console.log(error)
})
    }
}
