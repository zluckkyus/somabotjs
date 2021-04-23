const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

/**
 * Faz a verificação dos votos do site Zuraaa
 * @param {Discord.Message} message Objeto Message retornado pelo evento Client.on('message')
 * @param {void} callback Função que será chamada ao receber um voto, retorna o objeto User com os dados do usuário que votou
 */
module.exports.verificaVotos = (message, callback) => {
    
    // Verifica se a mensagem foi enviada pelo bot Zuraaa no canal site_logs (servidor Bots Para Discord)
    if(message.author.id == '745828915993640980' && message.channel.id == '537433191393525760'){
        try {
            // Verifica se a mensagem é a informação de um voto no seu bot
            const regx = new RegExp('(.+) \\(([0-9]+)\\) votou no bot `' + escapeRegex(message.client.user.tag) + '`');
            const match = regx.exec(message.content.trim());

            // Extrai a ID do usuário que fez o voto
            if(match && match[2]){

                // Procura o usuário com a ID informada
                const user = message.client.users.cache.find(user => user.id == match[2]);

                // Chama a função com os dados do usuário
                if(user) callback(user);
                
            }
        }catch(error){
            console.log(error);
        }
    }
}