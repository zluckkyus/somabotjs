const fs = require('fs');

const Util = require('./util/MitUtil.js');
const db = require('./util/Database.js');

const Discord = require('discord.js');
const { prefix, token, ownerid, logchannelid, database, giphy, serverbypass } = require('./config.json');
const AntiSpam = require('discord-anti-spam');
const Canvas = require('canvas');

const antiSpam = new AntiSpam({
    warnThreshold: 5, // Amount of messages sent in a row that will cause a warning.
    kickThreshold: 7, // Amount of messages sent in a row that will cause a ban.
    banThreshold: 10, // Amount of messages sent in a row that will cause a ban.
    maxInterval: 3000, // Amount of time (in milliseconds) in which messages are considered spam.
    warnMessage: '{@user}, Calma! Não tenha pressa, digite devagar.', // Message that will be sent in chat upon warning a user.
    kickMessage: '**{user_tag}** Foi expulso por spam.', // Message that will be sent in chat upon kicking a user.
    banMessage: '**{user_tag}** Foi Banido por spam..', // Message that will be sent in chat upon banning a user.
    maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
    exemptPermissions: serverbypass, // Bypass users with any of these permissions.
    ignoreBots: true, // Ignore bot messages.
    verbose: true, // Extended Logs from module.
    ignoredUsers: [], // Array of User IDs that get ignored.
});

const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.UsersBalance = new Discord.Collection();
client.commands = new Discord.Collection();
client.queue = new Map();

client.on("message", async (message) => {
  let p;
  let c = await db.get(`${message.guild.id}_prefix`)
  let b = await db.has(`${message.guild.id}_prefix`)
  
  if (!b) {
    p = prefix
  } else {
    p = c
  }
  
  let embed = new Discord.MessageEmbed()
   .setColor("RED")
   .setAuthor(client.user.username, client.user.displayAvatarURL())
   .setDescription(`Olá ${message.author}, se você está com duvidas sobre mim. ${p}help\n\n**💸 Você quer ajudar o bot? Entre em meu servidor e doe! Caso você não tenha dinheiro ha outras formas!**`)
   .setTimestamp()
   
   
  if (message.content.startsWith(`<@${client.user.id}>` || `<@!${client.user.id}>`)) {
    message.channel.send(embed)
  }
})

let rawdata = fs.readFileSync('./include/assets/json/game.json', "utf-8");
let Game = JSON.parse(rawdata);

let ListOfFiles = Game.data["filecommands"];

for (let i = 0; i < ListOfFiles.length; i++) {
    const commandFiles = fs.readdirSync(`./commands/${ListOfFiles[i]}/`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${ListOfFiles[i]}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.on('ready', () => {
    console.log('Logado ' + client.user.username);
    console.log("Comandos: " + client.commands.size);
    console.log("Usuarios: " + client.users.cache.size);
    console.log("Servidores : " + client.guilds.cache.size);
    console.log("Canais: " + client.channels.cache.size + "\n");

    setInterval(() => {
        const activities_list = [
            `s.help | ⭐ Entre em meu servidor de suporte!`,
            `s.help | 🔰 Servindo seu Servidor!`,
            `s.help | 🍜 Eu amo cozinhar!!`,
            `s.help | 🎄 Sou um Otimo bot para seu servidor!`,
            `s.help | ❓ Duvidas? Problemas? Entre em meu servidor de suporte s.invite!`
        ];

        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 10000);

    setInterval(() => {
        Util.refreshsubreddit();
    }, 600000);
});
/*

client.on('message', async (message) => {
  let p;
  let c = await db.get(`${message.guild.id}_prefix`)
  let b = await db.has(`${message.guild.id}_prefix`)
  
  if (!b) {
    p = prefix
  } else {
    p = c
  }
  db.add(`mensagem_${message.channel.id}_${message.guild.id}`, '1')
  let droop = new Discord.MessageEmbed()
   .setTitle('Drop!')
   .setColor('RED')
   .setDescription(`Uma caixa caiu! Ela deve ter alguma coisa! digite \`${p}claim\` para resgatar!`)
  
  let dropmsg = db.get(`mensagem_${message.channel.id}_${message.guild.id}`)
  let coins = Math.random(Math.round() * 1000) + 4
  const filtro = (msg) => msg.guild.id === message.guild.id && msg.content === `${p}claim`
  
  if (dropmsg === '10') {
    message.channel.send(droop)
    client.awaitMessages(filtro, { max: 1, time: 60000}).then((msg) => {
      let id = msg.first().author.id
      
      msg
       .first()
       .reply(`Parabens voce resgatou ${coins}, veja seu saldo!`)
      db.add(`${id}_money`, coins)
      db.set(`mensagem_${message.channel.id}_${message.guild.id}`, '0')
    })
  }
})
*/



client.on('message', async message => {
    try {
        if (message.author.bot || !message.guild || !message.guild.available) return;

        var start = new Date();
        let Emp = await db.has(`${message.author.id}_job`)
        let ServerPrefix = prefix;
        let ServerAntiSpam = "off";
        let ServerFilterInvite = "off";
        let SobreMim = "Digite s.sobremim para alterar esta mensagem.";
        
        let sobre = await db.has(`Perfil/${message.author.id}`)
        
        if (!Emp) {
          await db.set(`${message.author.id}_job`, null)
        }

        if (!sobre) {
          await db.set(`Perfil/${message.author.id}`, SobreMim)
        }

        let HasPrefix = await db.has(`${message.guild.id}_prefix`);
        if (!HasPrefix) {
            await db.set(`${message.guild.id}_prefix`, prefix);
            await db.set(`${message.guild.id}_antispam`, "off");
            await db.set(`${message.guild.id}_invitefilter`, "off");
            await db.set(`${message.guild.id}_welcome`, "off");
        }
        else {
            ServerPrefix = await db.get(`${message.guild.id}_prefix`);
            ServerAntiSpam = await db.get(`${message.guild.id}_antispam`);
            ServerFilterInvite = await db.get(`${message.guild.id}_invitefilter`);
        }

        if (ServerAntiSpam == "on") {
            antiSpam.message(message);
        }

        if (ServerFilterInvite == "on") {
            const inviteRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.me)\/([^ ]+)\/?/gi;
            const botInvRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(app)?\.com\/(api\/)?oauth2\/authorize\?([^ ]+)\/?/gi;

            let UserImmune = false;
            for (let i = 0; i < serverbypass.length; i++) {
                if (message.member.hasPermission(serverbypass[i])) {
                    UserImmune = true;
                }
            }

            if (!UserImmune) {
                if (message.content.match(inviteRegex) || message.content.match(botInvRegex)) {
                    message.reply("⚠️ Evite enviar muitos links!!");
                    return message.delete();
                }
            }
        }

        await db.add(`${message.author.id}_experience`, 1);
        if (!message.content.startsWith(ServerPrefix)) return;

        const args = message.content.slice(ServerPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();

        let HasUserInfo = await db.has(`${message.author.id}_info`);
        if (!HasUserInfo) {
            await db.set(`${message.author.id}_info`, `${message.author.tag}`);
        }

        let HasUserJob = await db.has(`${message.author.id}_job`);
        if (!HasUserJob) {
            await db.set(`${message.author.id}_job`, -1);
        }

        let HasUserPromotion = await db.has(`${message.author.id}_promotion`);
        if (!HasUserPromotion) {
            await db.set(`${message.author.id}_promotion`, 0);
        }

        let HasBase = await db.has(`${message.author.id}_base`);
        if (!HasBase) {
            await db.set(`${message.author.id}_base`, -1);

            await db.set(`${message.author.id}_basedefense`, 0);
            await db.set(`${message.author.id}_baseluck`, 0);

            await db.set(`${message.author.id}_defense`, 0);
            await db.set(`${message.author.id}_luck`, 0);
        }

        let Shops = Game.data["Shops"];
        let Upgrades = Game.data["Upgrades"];
        for (let i = 0; i < Shops.length; i++) {
            if (!db.has(`${message.author.id}_${Shops[i]}`)) {
                await db.set(`${message.author.id}_${Shops[i]}`, 0);
            }
        }

        for (let i = 0; i < Upgrades.length; i++) {
            if (!db.has(`${message.author.id}_${Upgrades[i]}`)) {
                await db.set(`${message.author.id}_${Upgrades[i]}`, 0);
            }
        }

        let MoneyPrinter3 = 0;
        let MoneyPrinter3Upgrade = 0;

        let HasMoneyPrinter1 = await db.has(`${message.author.id}_moneyprintermk1`) || await db.has(`${message.author.id}_moneyprintermk3`);
        if (HasMoneyPrinter1) {
            let MoneyPrinter = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk1`));
            MoneyPrinter3 = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk3`));

            let MoneyPrinterUpgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk1'].upgrade);
            MoneyPrinter3Upgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk3'].upgrade);

            MoneyPrinter = MoneyPrinter * MoneyPrinterUpgrade;
            MoneyPrinter3 = MoneyPrinter3 * MoneyPrinter3Upgrade;

            let NumerToAdd = Math.floor(1 + MoneyPrinter + MoneyPrinter3);

            await db.add(`${message.author.id}_balance`, NumerToAdd);
        }
        else {
            await db.add(`${message.author.id}_balance`, 1);
        }

        await db.add(`${message.author.id}_messages`, 1);

        if (message.mentions.everyone) {
            return;
        }

        const command = client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.Premium) {
            if (message.author.id != ownerid) {
                return message.reply("Este comando é premium");
            }
        }
        /*
        if (command.args != args.length && command.args != 0 && !(command.args == -1 && args.length > 0)) {
            let reply = "**Descrição:** " + command.description + "\n";
            reply += "**Cooldown:** " + command.cooldown || "Sem Cooldown" + "\n";
            reply += "\n**Aliases:** " + command.aliases || "Sem Aliases" + "\n";
            reply += "\n**Uso:** \n" + ServerPrefix + command.name + " " + command.usage || "Sem uso" + "\n";

            const UsageEmbed = new Discord.MessageEmbed()
                .setColor('#8B0000')
                .setTitle('Comando: ' + ServerPrefix + command.name)
                .setDescription(reply)
                .setTimestamp();

            return message.channel.send(UsageEmbed);
        }
        */

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        if (message.author.id != ownerid) {
            var now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if (!timestamps.has(message.author.id)) {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            } else {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) + 1000;
                    return message.channel.send({
                        embed: {
                          color: "#303136",
                            title: `Eita! Você está executando comandos rapido demais!`,
                            description: `Espere **${Util.msToTime(timeLeft)}** para executar \`${command.name}\` novamente!`
                            
                        }
                    });
                }

                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
            }
        }

        try {
            if (message.mentions.users.first()) {
                if (message.mentions.users.first().bot) {
                    return 
                }
            }

            let HasMoneyPrinter3 = await db.has(`${message.author.id}_moneyprintermk3`);
            let HasMoneyPrinter2 = await db.has(`${message.author.id}_moneyprintermk2`);
            if (HasMoneyPrinter2 || HasMoneyPrinter3) {
                let MoneyPrinter3 = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk3`));
                let MoneyPrinter3Upgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk3'].upgrade);
                MoneyPrinter3 = MoneyPrinter3 * MoneyPrinter3Upgrade;

                let MoneyPrinter2 = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk2`));
                let MoneyPrinter2Upgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk2'].upgrade);
                MoneyPrinter2 = MoneyPrinter2 * MoneyPrinter2Upgrade;

                let NumerToAdd2 = Math.floor(1 + MoneyPrinter2 + MoneyPrinter3);

                await db.add(`${message.author.id}_balance`, NumerToAdd2);
            }

            await db.add(`${message.author.id}_experience`, 5);
            await db.add(`botstats_totalcommand`, 1);

            let DBexperience = await db.get(`${message.author.id}_experience`);
            let DBLevels = 0;
            let DBValue = parseInt(DBexperience);
            for (let i = 0; i < 999; i++) {
                DBValue = DBValue - (400 * i);
                if (DBValue > 0) {
                    DBLevels += 1;
                }
                else {
                    break;
                }
            }
            await db.set(`${message.author.id}_level`, DBLevels);

            command.execute(message, args, client);

            var end = new Date() - start;
            let channel = client.channels.cache.get("749556856866996266");
            if (channel) {
                channel.send(`${message.guild.name} - ${message.channel.name} -> ${message.author.tag}: ${message.content}`);
            }

            console.log(`${message.guild.name} - ${message.channel.name} -> ${message.author.tag}: ${message.content} ( Took %dms)`, end);
        } catch (error) {
            console.error(error);
            message.reply('Sorry! I ran into an error trying to do that!');
        }
    }
    catch (err) {
        console.log(err);
    }
});

client.on('guildMemberAdd', async member => {
    try {
        await db.set(`${member.id}_info`, `${member.user.tag}`);

        let ServerWelcome = await db.get(`${member.guild.id}_welcome`);
        if (ServerWelcome == "0") return;

        let channel = member.guild.channels.cache.get(ServerWelcome.toString());
        if (!channel) {
            return await db.set(`${member.guild.id}_welcome`, "0");
        }

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('./img/wallpaper.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Slightly smaller text placed above the member's display name
        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

        // Add an exclamation point here and below
        ctx.font = Util.jsapplyText(canvas, `${member.displayName}!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        channel.send(`Welcome to the server, ${member}!`, attachment);
    }
    catch (err) {
        console.log(err);
    }
});

client.on("guildCreate", guild => {
    try {
        db.set(`${guild.id}_info`, `${guild.name}`);

        client.users.cache.get(ownerid).send(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
        client.users.cache.get("630037674522181652").send(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
        console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    }
    catch (err) {
        console.log(err);
    }
});

client.on("guildDelete", guild => {
    try {
        client.users.cache.get(ownerid).send(`I have been removed from: ${guild.name} (id: ${guild.id})`);
        client.users.cache.get("630037674522181652").send(`I have been removed from: ${guild.name} (id: ${guild.id})`);
        console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    }
    catch (err) {
        console.log(err);
    }
});

/*
dbl.webhook.on('vote', vote => {
  let Reward = 7500;
  if (vote.isWeekend) {
    Reward = Reward * 2;
  }

  let VoteUser = client.users.cache.get(vote.user);
  if (VoteUser) {
    VoteUser.send({
      embed: {
        title: "Vote Reward",
        description: `Thank you for voting!\nEnjoy your **${Util.moneyFormat(Reward)}** reward!`,
        color: "#8B0000",
        timestamp: new Date()
      }
    });
  }

  db.add(`${vote.user}.balance`, Reward);
  console.log(`User with ID ${vote.user} just voted!`);
});*/

client.login("NzkwNzg1NDU2NzczMTM2Mzg0.X-FqWA.uL3W7FxGLoW-SYL8_PYU8m-To0c")
