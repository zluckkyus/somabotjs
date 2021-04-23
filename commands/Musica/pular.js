module.exports = {
    name: "skip",
      category: "🎵 Musica",
      usage: " ",
      description: "Pule a musica atual.",
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
    if(!queue){ return message.channel.send({
        embed: {
            description: 'Não há nada tocando, tente colocar alguma musica. \`s.play <musica>\``',
            color: 'BLACK'
        }
    })
}
    if(queue.songs.length !== 0) {
        message.react('✅')
        queue.connection.dispatcher.end('⏩ **Musica foi pulada**!')
    }
}
}