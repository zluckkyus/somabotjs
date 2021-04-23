const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  description: "Veja a letra da musica atual",
  category: "🎵 Musica",
  cooldown: 5,
  async execute(message, args, client) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("❌ | Não há nada tocando.").catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `❌ | Nenhuma letra encontrada para ${queue.songs[0].title} :(`;
    } catch (error) {
      lyrics = `❌ | Nenhuma letra encontrada para ${queue.songs[0].title} :(`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle(`Letra ${queue.songs[0].title}`)
      .setDescription(lyrics)
      .setColor("BLUE")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
}