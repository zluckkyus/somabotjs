module.exports = {
  name: "slowmode",
  category: "👮 Moderação",
  description: "Coloque slowmode no canal.",
  args: 0,
  usage: "<tempo>",
  async execute(message, args, client) {
    const amount = parseInt(args[0]);
    if (!message.member.hasPermission("MANAGE_CHANNEL")) return message.reply("Você não pode usar este comando, tenha a permissão `GERÊNCIAR CANAIS`, para usar este comando")
    if(!message.guild.me.hasPermission("MANAGE_CHANNEL")) return message.reply("Eu não tenho permissão para executar este comando, me dê a permissão `GERÊNCIAR CANAIS`, para usar este comando")
      if (isNaN(amount))
        return message.channel.send("🤷 **| Eu não encontrei nenhum numero valido.**");
    if (args[0] === amount + "s") {
      message.channel.setRateLimitPerUser(amount);
      if (amount > 1) {
        message.channel.send("⏲️ **| SlowMode agora é " + amount + " Segundos**");
        return;
      } else {
        message.channel.send("⏲️ **| SlowMode agora é " + amount + " Segundo**");
        return;
      }
    }
    if (args[0] === amount + "min") {
      message.channel.setRateLimitPerUser(amount * 60);
      if (amount > 1) {
        message.channel.send("⏲️ **| SlowMode agora é " + amount + " Minutos**");
        return;
      } else {
        message.channel.send("⏲️ **| SlowMode agora é " + amount + " Minuto**");

        return;
      }
    }
    if (args[0] === amount + "h") {
      message.channel.setRateLimitPerUser(amount * 60 * 60);
      if (amount > 1) {
        message.channel.send("⏲️ **| SlowMode agora é " + amount + " Horas**");
        return;
      } else {
        message.channel.send("⏲️ **| SlowMode agora é " + amount + " Hora**");
        return;
      }
    } else {
      message.reply(
        "🙄 Você só pode colocar segundos(s) Minutos(min) e horas(h)!"
      );
    }
  }
};