const db = require("quick.db");

module.exports = {
    name: "setmuterole",
    category: "⚙️ Configuração",
    args: 0,
    aliases: ["setmute", "smrole", "smr"],
    description: "Configura um cargo de mute.",
    usage: "[nome | menção | ID]",
  async execute(message, args, client) {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        "⚠️ **Você não tem permissões para configurar - [ADMNISTRADOR]**"
      );
    if (!args[0]) {
      let b = await db.fetch(`muterole_${message.guild.id}`);
      let roleName = message.guild.roles.cache.get(b);
      if (message.guild.roles.cache.has(b)) {
        return message.channel.send(
          `✅ **O Cargo de mute nesta guilda está configurado - \`${roleName.name}\`!**`
        );
      } else
        return message.channel.send(
          "⚠️ **Peço que Mencione o cargo!**"
        );
    }

    let role =
      message.mentions.roles.first() ||
      client.guilds.cache.get(message.guild.id).roles.cache.get(args[0]) ||
      message.guild.roles.cache.find(
        c => c.name.toLowerCase() === args.join(" ").toLocaleLowerCase()
      );

    if (!role)
      return message.channel.send("⚠️ **Coloque um nome ou id valido!**");

    try {
      let a = await db.fetch(`muterole_${message.guild.id}`);

      if (role.id === a) {
        return message.channel.send(
          "⚠️ **Este cargo já está configurado!**"
        );
      } else {
        db.set(`muterole_${message.guild.id}`, role.id);

        message.channel.send(
          `✅ **\`${role.name}\` o Cargo foi configurado com sucesso.**`
        );
      }
    } catch (e) {
      return message.channel.send(
        "**Erro - `Falta de permissões ou cargo não existe!`**",
        `\n${e.message}`
      );
    }
  }
};