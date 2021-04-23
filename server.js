const { Client, Collection } = require("discord.js");
const klaw = require("klaw");
const path = require("path");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

class Main extends Client {
  constructor(options) {
    super(options);
    this.commands = new Collection();
    this.aliases = new Collection();
  }

  login(token) {
    token = process.env.TOKEN;
    return super.login(token);
  }

  load(commandPath, commandName) {
    const props = new (require(`${commandPath}/${commandName}`))(this);
    props.location = commandPath;
    if (props.init) {
      props.init(this);
    }
    this.commands.set(props.name, props);
    props.aliases.forEach((aliases) => {
      this.aliases.set(aliases, props.name);
    });
    return false;
  }
}

const onLoad = async () => {
  klaw("src/commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.load(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) return;
  });

  const eventFiles = await readdir(`./functions/`);
  eventFiles.forEach((file) => {
    const eventName = file.split(".")[0];
    const event = new (require(`./functions/${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./functions/${file}`)];
  });

  client.login();
};

onLoad();

module.exports = {
  Util: require("./src/server.js"),
};