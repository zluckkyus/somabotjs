const Util = require('../../util/MitUtil.js');
const { MessageEmbed } = require("discord.js");
const db = require('../../util/Database.js');

module.exports = {
    name: 'help',
    description: 'Retorna todos os meus comandos.',
    aliases: ['commands','cmd','ajuda'],
    cooldown: 2,
    args: 0,
    category: '🍦 Utilidades',
    hidden: true,
    async execute(message, args, client) {
        let ServerPrefix = await db.get(`${message.guild.id}_prefix`)
    if (args[0]) {
      const command = await client.commands.get(args[0]);

      if (!command) {
        return message.channel.send("Comando desconhecido: " + args[0]);
      }

      let embed = new MessageEmbed()
        .setAuthor(command.name, message.author.displayAvatarURL())
        .addField("Descrição", command.description || "Não Adicionado")
        .addField("Uso", command.usage || "Não Adicionado", true)
        .addField("Cooldown", command.cooldown || "Sem Cooldown", true)
        .setThumbnail(message.guild.iconURL())
        .setColor("ff0000")
        .setFooter(client.user.username, client.user.displayAvatarURL());


      return message.channel.send(message.author, embed);
    } else {
      const commands = await client.commands;

      let emx = new MessageEmbed()
        .setAuthor("Painel de Comandos", client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`Olá eu sou ${client.user} Aqui está a minha lista de comandos, se tem alguma duvida sobre o comando, digite. **\`${ServerPrefix}help <comando>\`** Se tiver duvidas entre em contato com o dono.\n\n🔝 | **Vote em Mim e me ajude! [Votar](https://www.zuraaa.com/bots/790785456773136384/) **`)
        .setColor("ff0000")
        .setFooter(message.author.username, message.author.displayAvatarURL())

      let com = {};
      for (let comm of commands.array()) {
        let category = comm.category || "Desconhecido";
        let name = comm.name;

        if (!com[category]) {
          com[category] =  [];
        }
        com[category].push(name);
      }

      for(const [key, value] of Object.entries(com)) {
        let category = key;

        let desc = "`" + value.join("`, `") + "`";

        emx.addField(`# ${category.toUpperCase()}[${value.length}]`, desc);
      }

      return message.channel.send(message.author, emx);
    }
    }
};