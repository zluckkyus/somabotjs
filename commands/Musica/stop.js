module.exports = {
      name: "stop",
      category: "🎵 Musica",
      usage: " ",
      description: "Pare a musica.",
      cooldown: 5,
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
      description: 'Não há nada tocando!',
      color: 'BLACK'
    }
  })
  message.react('✅')
  queue.songs = []
  queue.connection.dispatcher.end('⏯️ **Finalizando o batidão.**')
 }
}