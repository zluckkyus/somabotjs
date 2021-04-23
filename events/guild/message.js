const db = require('quick.db');
const { prefixo } = require('../../config.js');
const queue2 = new Map();
const queue3 = new Map();
const queue = new Map();
const games = new Map();

module.exports = async (client, message) => {
    try {
        if (message.author.client || message.channel.type === "dm") return;

        let prefix;
        let fetched = await db.fetch(`prefix_${message.guild.id}`);

        if (fetched === null) {
            prefix = prefixo
        } else {
            prefix = fetched
        }

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();

        if (!message.content.startsWith(prefix)) return;

        let ops = {
            queue: queue,
            queue2: queue2,
            queue3: queue3,
            games: games
        }

        var commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
        if (commandfile) commandfile.run(client, message, args, ops);
    } catch (error) {
        console.log(error);
    }
}