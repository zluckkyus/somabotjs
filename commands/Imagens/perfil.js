const abbrNum = require('number-abbreviate')
const fs = require('fs')
const {Canvas,fillWithEmoji} = require('discord-emoji-canvas')
const Util = require('../../util/MitUtil.js')
const { MessageAttachment } = require('discord.js')
const db = require('../../util/Database.js')
// Fontes
Canvas.registerFont("./src/fonts/Montserrat-Black.ttf", { family: "Montserrat" });
Canvas.registerFont("./src/fonts/Segoe Print.ttf", { family: "Segoe Print" });
Canvas.registerFont("./src/fonts/Segoe UI.ttf", { family: "Segoe UI" });
Canvas.registerFont("./src/fonts/Segoe UI Black.ttf", {
  family: "Segoe UI Black",
});

// Quebra de Linha
function addBreakLines(str, max) {
        max = max + 1;
        for (let i = 0; i < str.length / max; i++) {
          str =
            str.substring(0, max * i) +
            `\n` +
            str.substring(max * i, str.length);
        }
        return str;
      }

// Emprego
let rawdata = fs.readFileSync('./include/assets/json/jobs.json');
let Game = JSON.parse(rawdata);

// Comando
module.exports = {
  name: "perfil",
args: 0,
  category: "🍦 Utilidades",
  description: "Veja seu Perfil.",
  async execute(message, args, client) {
    let JobArray = Game["data"]
    let OptionNumber = await db.get(`${message.author.id}_job`)
    let emprego = Game.jobs[JobArray[OptionNumber]].lebel
    // Loads
    const USER = client.users.cache.get(args[0]) || message.mentions.users.first() || message.author;
    const canvas = Canvas.createCanvas(1280,720)
    const ctx = canvas.getContext('2d')
    
    // BackGround
    const background = await Canvas.loadImage("./src/img/background.png")
    const base = await Canvas.loadImage("./base.png");
    ctx.drawImage(background, 0, 0, 1280, 720)
    ctx.drawImage(base, 0, 0, 1280, 720)
    
      // Username

      ctx.textAlign = "left";
      ctx.font = '60px "Segoe UI Black"';
      ctx.fillStyle = "rgb(253, 255, 252)";
      await fillWithEmoji(ctx, 
        USER.username.length > 14
          ? USER.username.slice(0, 14) + "..."
          : USER.username,
        245,
        120)

      // Titles
      var mim = await db.get(`Perfil/${USER.id}`)
      ctx.textAlign = "left";
      ctx.font = '43px "Segoe UI Black"';
      ctx.fillStyle = "rgb(253, 255, 252)";
      await fillWithEmoji(ctx, "💰 Coins", 10, 260);
      await fillWithEmoji(ctx, "🏦 Banco", 10, 350);
      await fillWithEmoji(ctx, `💼 Emprego: ${emprego || "Desempregado"}`, 245, 180)
      ctx.textAlign = "left";
      ctx.font = '35px "Segoe UI Black"';
      ctx.fillStyle = "rgb(253, 255, 252)";
      ctx.fillText(
        addBreakLines((mim), 70), 10, 570)
      
      // Coins/XP
      let Balance = Util.NotNumberCheck(await db.get(`${USER.id}_balance`));
      let Vault = Util.NotNumberCheck(await db.get(`${USER.id}_vault`));
      
      ctx.textAlign = "left";
      ctx.font = '33px "Segoe UI"';
      ctx.fillStyle = "rgb(253, 255, 252)";
      ctx.fillText(`${Util.moneyFormat(Balance)}`, 40, 300);
      ctx.fillText(`${Util.moneyFormat(Vault)}`, 40, 390);

      //========================// Import Avatar //========================// 95, 85
      ctx.arc(120, 100, 105, 0, Math.PI * 2, true);
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#faf5f5";
      ctx.stroke();
      ctx.closePath();
      ctx.clip();

      const avatar = await Canvas.loadImage(USER.displayAvatarURL({ format: "jpeg" }));
      ctx.drawImage(avatar, 15, -5, 220, 220);
    
    // Buffer LoadImage
    const buffer = canvas.toBuffer()
    const attach = new MessageAttachment(buffer, `Profile_${USER.tag}_.png`);
    // Send Message
    message.channel.send(attach)
  }
}
