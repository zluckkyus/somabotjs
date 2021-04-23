const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "queue",
  aliases: ["fila"],
  category: "🎵 Musica",
  cooldown: 4,
  description: "Veja as musicas na fila",
  async execute(message, args, client) {
  const channel = message.member.voice.channel;
  if (!channel) return message.channel.send({
    embed: {
      title: "Erro",
      color: "RED",
      description: "❌ Você não está em um canal de voz, entre em algum e tente novamente."
    }
  });
  const queue = message.client.queue.get(message.guild.id)
  let status;
  if (!queue) status = 'Nenhuma musica na fila...'
  else status = queue.songs.map(x => '• ' + x.title + ' - Pedido por ' + `<@${x.requester.id}>`).join('\n')
  if (!queue) np = status
  else np = queue.songs[0].title
  if (queue) thumbnail = queue.songs[0].thumbnail.url 
  else thumbnail = message.guild.iconURL()
  let embed = new MessageEmbed()
    .setTitle('Fila')
    .setThumbnail(thumbnail)
    .setColor('BLUE')
    .addField('Tocando agora', np, true)
    .setDescription(status)
  message.channel.send(embed)
}
}