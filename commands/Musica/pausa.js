module.exports = {
  name: "pausa",
  aliases: ["pause"],
  description: "Pause a Musica",
  usage: " ",
  cooldown: 3,
  category: "🎵 Musica",
  async execute(message, args, client) {
  const channel = message.member.voice.channel;
  if (!channel) return message.channel.send({
    embed: {
      title: "Erro",
      color: "RED",
      description: "❌ Você não está em um canal de voz, entre em algum e tente novamente."
    }
  });
  let queue = message.client.queue.get(message.guild.id)
  if (!queue) return message.channel.send({
    embed: {
      title: "Erro",
      color: "RED",
      description: 'Não há nenhuma musica tocando no momento!'
    }
  })
  if (queue.playing !== false)
    queue.connection.dispatcher.pause()
  message.react('⏸')
  message.channel.send('⏸ **Musica pausada.**')
 }
}