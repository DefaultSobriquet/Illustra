import {Collection, Client} from "discord.js";
import {promisify} from "util";
const readdir = promisify(require("fs").readdir);
import {connect} from "mongoose";


const client = new Client();

import config from "./config.js";

//@ts-ignore
client.config = config;

require("./modules/utils.js")(client);
require("./modules/users.js")(client);
require("./modules/emotes.js")(client);
require("./modules/roles.js")(client);

//@ts-ignore Until we add a proper Client wrapper, this is the best we can do.
client.commands = new Collection();
//@ts-ignore Same here.
client.aliases = new Collection();

// The init script - prepares it all for starting
const init = async () => {
	// Searches for all commands & loads them
	const cmdFolders = await readdir("./commands/");
	for (const folder of cmdFolders) {
		const cmdFiles = await readdir(`./commands/${folder}/`);
		console.log(`Loading ${folder} Module (${cmdFiles.length} commands)`);
		cmdFiles.forEach((file: string) => {
			if (!file.endsWith(".js")) return;
			//@ts-ignore See above.
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
	//@ts-ignore See above.
	connect(`mongodb+srv://${client.config.mongo.username}:${client.config.mongo.password}@${client.config.mongo.database}/${client.config.name}?retryWrites=true&w=majority`, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useCreateIndex: true
	}, (err: Error) => {
		if (err) console.error(err);
	});

	//@ts-ignore See above.
	client.login(client.config.token);
};

init();
