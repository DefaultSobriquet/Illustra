const Discord = require("discord.js");
const Enmap = require("enmap");
const {promisify} = require("util");
const readdir = promisify(require("fs").readdir);
const {connect} = require("mongoose");


const client = new Discord.Client();

client.config = require("./config.js");

require("./modules/utils.js")(client);
require("./modules/users.js")(client);
require("./modules/emotes.js")(client);
require("./modules/roles.js")(client);

client.commands = new Enmap();
client.aliases = new Enmap();

// The init script - prepares it all for starting
const init = async () => {
	// Searches for all commands & loads them
	const cmdFolders = await readdir("./commands/");
	for (const folder of cmdFolders) {
		const cmdFiles = await readdir(`./commands/${folder}/`);
		console.log(`Loading ${folder} Module (${cmdFiles.length} commands)`);
		cmdFiles.forEach((file: string) => {
			if (!file.endsWith(".js")) return;
			const response = client.loadCommand(file, folder);
			if (response) console.log(response);
		});
	}
	// Searches for all events & loads them
	const evtFiles = await readdir("./events/");
	console.log(`Loading Events (Total ${evtFiles.length})`);
	evtFiles.forEach((file: string) => {
		const eventName = file.split(".")[0];
		console.log(`Loading Event: ${eventName}`);
		const event = require(`./events/${file}`);
		client.on(eventName, event.bind(null, client));
	});

	connect(`mongodb+srv://${client.config.mongo.username}:${client.config.mongo.password}@${client.config.mongo.database}/${client.config.name}?retryWrites=true&w=majority`, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	}, (err: Error) => {
		if (err) console.error(err);
	});

	client.login(client.config.token);
};

init();
