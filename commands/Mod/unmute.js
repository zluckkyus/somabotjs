const { MessageEmbed } = require("discord.js")
const { redlight } = "#ff0000"
const db = require('quick.db');

module.exports = {
        name: "unmute",
        aliases: ["um"],
        description: "Desmuta algum usuario.",
        usage: "[name | nickname | menção | ID] <motivo> (opcional)",
        args: 0,
        category: "👮 Moderação",
    async execute(message, args, client) {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("⚠️ **Você não tem permissão para desmutar alguem! - [Gerênciar Servidor]**");

        if (!message.guild.me.hasPermission("MANAGE_GUILD")) return message.channel.send("⚠️ **Eu não tenho permissão para executar este comando! - [Gerênciar Servidor]**")
        if (!args[0]) return message.channel.send("⚠️ **Mencione algum usuario!**")
        let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!mutee) return message.channel.send("⚠️ **Mencione algum usuario valido!**");

        let reason = args.slice(1).join(" ");

        let muterole;
        let dbmute = await db.fetch(`muterole_${message.guild.id}`);
        let muteerole = message.guild.roles.cache.find(r => r.name === "muted")

        if (!message.guild.roles.cache.has(dbmute)) {
            muterole = muteerole
        } else {
            muterole = message.guild.roles.cache.get(dbmute)
        }
      
        let rolefetched = db.fetch(`muteeid_${message.guild.id}_${mutee.id}`)
        if (!rolefetched) return;

        if (!muterole) return message.channel.send("❌ **Não encontrei nenhum cargo de Mutado neste usuario.**")
        if (!mutee.roles.cache.has(muterole.id)) return message.channel.send("⚠️ **o Usuario não está mutado!**")
        try {
        mutee.roles.remove(muterole.id).then(() => {
            mutee.send(`**🙊 Olá, Você foi desmutado em ${message.guild.name} por ${reason || "Sem Motivo"}**`).catch(() => null)
            let roleadds = rolefetched
            if (!roleadds) return;
            mutee.roles.add(roleadds)
        })
        } catch {
            let roleadds2 = rolefetched
            if (!roleadds2) return;
            mutee.roles.add(roleadds2)                            
          }
            const sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`${mutee.user.username} Foi desmutado com sucesso.`)
            message.channel.send(sembed);
        

        let channel = db.fetch(`modlog_${message.guild.id}`)
        if (!channel) return;

        let embed = new MessageEmbed()
            .setColor(redlight)
            .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("**Moderação**", "unmute")
            .addField("**Desmutado**", mutee.user.username)
            .addField("**Moderador**", message.author.username)
            .addField("**Motivo**", `${reason || "**Não Providênciado**"}`)
            .addField("**Data**", message.createdAt.toLocaleString())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(embed)

    }
}