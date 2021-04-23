const { MessageEmbed } = require("discord.js");
const { redlight } = '#ff0000';
const db = require('quick.db');

module.exports = {
        name: "mute",
        description: "Muta um um membro na guilda!",
        usage: "[nome | nickname | menção | ID] <motivo> (opcional)",
        category: "👮 Moderação",
        accessableby: "Administrator",
        args: 0,
        aliases: ['mutar','silenciar'],
      async execute(message, args, client) {
        try {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("⚠️ **Você nao tem permissão para mutar! - [Gerênciar Servidor]**");

            if (!message.guild.me.hasPermission("MANAGE_GUILD")) return message.channel.send("⚠️ **Eu não tenho permissões para mutar! - [Gerênciar Servidor]**")
            if (!args[0]) return message.channel.send("⚠️ **Mencione algum usuario para mutar!**");

            var mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            if (!mutee) return message.channel.send("⚠️ **Mencione algum usuario valido para mutar!**");

            if (mutee === message.member) return message.channel.send("❌ **Você não pode mudar você mesmo")
            if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('❌ **Você não pode mutar este usuario!**')

            let reason = args.slice(1).join(" ");
            if (mutee.user.bot) return message.channel.send("❌ **Você não pode mutar bot!**");
            const userRoles = mutee.roles.cache
                .filter(r => r.id !== message.guild.id)
                .map(r => r.id)

            let muterole;
            let dbmute = await db.fetch(`muterole_${message.guild.id}`);
            let muteerole = message.guild.roles.cache.find(r => r.name === "muted")

            if (!message.guild.roles.cache.has(dbmute)) {
                muterole = muteerole
            } else {
                muterole = message.guild.roles.cache.get(dbmute)
            }

            if (!muterole) {
                try {
                    muterole = await message.guild.roles.create({
                        data: {
                            name: "muted",
                            color: "#ff0000",
                            permissions: []
                        }
                    })
                    message.guild.channels.cache.forEach(async (channel) => {
                        await channel.createOverwrite(muterole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                            SPEAK: false,
                            CONNECT: false,
                        })
                    })
                } catch (e) {
                    console.log(e);
                }
            };

            if (mutee.roles.cache.has(muterole.id)) return message.channel.send("❌ **O Usuario ja esta mutado!**")

            db.set(`muteeid_${message.guild.id}_${mutee.id}`, userRoles)
          try {
            mutee.roles.set([muterole.id]).then(() => {
                mutee.send(`🙊 **Olá, você foi silênciado em ${message.guild.name} por - ${reason || "Sem Motivo"}`).catch(() => null)
            })
            } catch {
                 mutee.roles.set([muterole.id])                               
            }
                if (reason) {
                const sembed = new MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(`${mutee.user.username} Foi mutado com sucesso por - \`${reason}\``)
                message.channel.send(sembed);
                } else {
                    const sembed2 = new MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(`${mutee.user.username} Foi mutado com sucesso.`)
                message.channel.send(sembed2);
                }
            
            let channel = db.fetch(`modlog_${message.guild.id}`)
            if (!channel) return;

            let embed = new MessageEmbed()
                .setColor(redlight)
                .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
                .setAuthor(`${message.guild.name} ModLogs`, message.guild.iconURL())
                .addField("**Moderação**", "Mute")
                .addField("**Mute**", mutee.user.username)
                .addField("**Moderador**", message.author.username)
                .addField("**Motivo**", `${reason || "**Não Especificado**"}`)
                .addField("**Data**", message.createdAt.toLocaleString())
                .setFooter(message.member.displayName, message.author.displayAvatarURL())
                .setTimestamp()

            var sChannel = message.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send(embed)
        } catch {
            return;
        }
    }
}