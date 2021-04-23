const discord = require('discord.js')
const fetch = require("node-fetch")
 
module.exports = {
    name: "findemoji",
    aliases: ["finde", "fe"],
    category: "👮 Moderação",
    cooldown: 5,
    description: "Pega emojis de outros servidores e assim você pode adicionar eles sem seu servidor.",
    usage: "[nome]",
    async execute(message, args, client) {
      if (!message.member.hasPermission("MANAGE_EMOJIS")) return message.channel.send({
        embed: {
          title: "Erro",
          color: "RED",
          description: "Você não tem permissão para executar este comando. `GERÊNCIAR EMOJIS`"
        }
      })
      
let emojis = await fetch("https://emoji.gg/api/").then(res => res.json());
     const q = args.join(" ").toLowerCase().trim().split(" ").join("_");
     let matches = emojis.filter(s => s.title == q || s.title.includes(q));
     
     let noResult = new discord.MessageEmbed()
        .setDescription(`:x: | Nenhum resultado encontrado de \`${args.join(" ")}\`!`)
        .setColor("FF2052")
     
     if (!matches.length) return message.channel.send(noResult)
     let page = 0;
     let embed = new discord.MessageEmbed()
     .setTitle(matches[page].title)
     .setURL("https://discordemoji.com/emoji/" + matches[page].slug)
     .setColor("00FFFF")
     .setImage(matches[page].image)
     .setFooter(`Emoji ${page + 1}/${matches.length}`);
     const msg = await message.channel.send(embed);
     emojis = ["◀️", "▶️", "✅", "❌"];
     msg.react(emojis[0]);
     msg.react(emojis[1]);
     msg.react(emojis[2]);
     msg.react(emojis[3]);
     const filter = (r, u) => emojis.includes(r.emoji.name.trim()) && u.id == message.author.id;
     let doing = true;
     while (doing) {
     let reaction;
     try { reaction = await msg.awaitReactions(filter, { max: 1, time: 120000, errors: ["time"] })}
     catch { message.channel.send(message.author.toString() + ", Você demorou, removendo reações."); msg.reactions.removeAll() ; doing = false; return; };
     reaction = reaction.first();
     const rmsg = reaction.message;
     if (reaction.emoji.name == emojis[0]) {
     page--;
     if (!matches[page]) {
     page++;
     rmsg.reactions.resolve(reaction.emoji.name).users.remove(message.author.id).catch(err => {})
     } else {
     let newembed = new discord.MessageEmbed()
     .setTitle(matches[page].title)
     .setURL("https://discordemoji.com/emoji/" + matches[page].slug)
     .setColor("00FFFF")
     .setImage(matches[page].image)
     .setFooter(`Emoji ${page + 1}/${matches.length}`);
     msg.edit(newembed);
     rmsg.reactions.resolve(reaction.emoji.name).users.remove(message.author.id).catch(err => {})
     }
     } else if (reaction.emoji.name == emojis[1]) {
     page++;
     if (!matches[page]) {
     page--;
     rmsg.reactions.resolve(reaction.emoji.name).users.remove(message.author.id).catch(err => {})
     } else {
     let newembed = new discord.MessageEmbed()
     .setTitle(matches[page].title)
     .setURL("https://discordemoji.com/emoji/" + matches[page].slug)
     .setColor("00FFFF")
     .setImage(matches[page].image)
     .setFooter(`Emoji ${page + 1}/${matches.length}`);
     msg.edit(newembed);
rmsg.reactions.resolve(reaction.emoji.name).users.remove(message.author.id).catch(err => {})
     }
     } else if (reaction.emoji.name == emojis[2]) {
      const res = matches[page];
      let created;
      message.channel.startTyping();
      try { 
        created = await message.guild.emojis.create(res.image, res.title);
        message.channel.stopTyping();
       } catch {
        message.channel.stopTyping();
        message.channel.send(`:x: | Impossivel adicionar \`${res.title}\`.`);
        rmsg.reactions.resolve(reaction.emoji.name).users.remove(message.author.id).catch(err => {})
        doing = false;
        break;
       }
       message.channel.send(`${created} | Emoji adicionado com sucesso!`);
       msg.delete()
      rmsg.reactions.resolve(reaction.emoji.name).users.remove(message.author.id).catch(err => {})
       doing = false;
       break;
 
     } else if (reaction.emoji.name == emojis[3]) {
       message.channel.send("✅ | Operação cancelada com sucesso.");
       msg.delete();
       return;
     }};
     
    }
}