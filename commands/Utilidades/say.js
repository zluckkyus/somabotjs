module.exports = ({
  name: "say",
  category: "🍦 Utilidades",
  args: 0,
  description: "Faça o bot falar as suas palavras.",
  async execute(message, args, client) {
    let fala = args.join(" ")
    
    if (!fala) return message.channel.send("🚫 **| Está faltando argumentos para executar este comando!**")
    
    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("🚫 **| Você não tem permissão para executar este comando.**")
    
    message.channel.send(`${fala}\n\n***Mensagem enviada por ${message.author}***`)
  }
})