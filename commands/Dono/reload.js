module.exports = {
  name: "reload",
  args: 0,
  hidden: true,
  category: "✨ Especiais",
  async execute(message, args, client) {
    if (message.author.id !== "777205185582727188") return message.channel.send("🚫 **| Você não pode usar esse comando**")
    if (!args[0]) return message.channel.send("🚫 **| Defina uma categoria! `s.reload categoria cmd`**")
    if (!args[1]) return message.channel.send("🚫 **| Defina um comando! `s.reload categoria cmd`**")
    
    let category = args[0]
    let command = args[1]
    
    try {
      delete require.cache[require.resolve(`../../commands/${category}/${command}.js`)]
      
      const pull = require(`../../commands/${category}/${command}.js`)
      client.commands.set(command, pull)
      
      return message.channel.send(`:star: **|** Sucesso Recarregando comando \`${command}.js\``)
    } catch (error) {
      return message.channel.send(`🚫 **|** Comando \`${command}.js\` não foi encontrado.\n${error.message}`)
    }
    
  }
}