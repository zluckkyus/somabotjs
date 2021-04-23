const Discord = require('discord.js');

module.exports = {
  name: "unlock",
  description: "Desbloqueie o canal de texto",
  category: "👮 Moderação",
  async execute(message, args, client) {

 if (!message.member.permissions.has("MANAGE_CHANNELS") || !message.member.permissions.has("ADMINISTRATOR")) {
   message.channel.send(`⚠️ Você nao tem permissão de \`ADMINISTRADOR\` ou de \`GERÊNCIAR CANAIS\` `)
 } else if (!message.guild.me.permissions.has("ADMINISTRATOR") || !message.guild.me.permissions.has("MANAGE_CHANNELS")) {
   message.channel.send(`⚠️ Eu nâo tenho permissão de \`ADMINISTRADOR\` ou de \`GERÊNCIAR CANAIS\``)
 } else {
 message.channel.send({
   embed: {
     title: '🔒 Destrancando o chat...',
     color: "RED"
   }
 }).then(msg => {
   message.channel.createOverwrite(message.guild.id, {
    SEND_MESSAGES: true
   })
   msg.edit({
     embed: {
       title: '🔓 Chat Destrancando com sucesso!',
       color: "BLUE"
     }
   })
 }).catch(msg => {
   msg.edit({
     embed: {
       title: '⚠️ Ocorreu um erro...',
       color: "RANDOM"
     }
   })
 })
 }
}
}