module.exports = {
  name: "volume",
  aliases: ["vol"],
  cooldown: 5,
  category: "🎵 Musica",
  description: "Aumente ou diminiua o volume da musica.",
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

    if(!args[0]) return message.channel.send({
        embed: {
            color: "BLUE",
            description: `🎧 O Volume atual é ` + queue.volume
        }
    })

    if(args[0] > 10) return message.channel.send('🎧 | Coloque um nome de 0 a 10 para definir o volume.')

    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    queue.volume = args[0]
    message.channel.send({
        embed: {
            color: "GREEN",
            description: 'Volume configurado para ' + args[0]
        }
    })
  }
}