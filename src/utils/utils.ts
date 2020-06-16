module.exports = (client: any) => {
	// Command Loader
	client.loadCommand = (commandName: string, commandFolder: string) => {
		try {
			console.log(`Loading command: ${commandName}`);
			const props = require(`../commands/${commandFolder}/${commandName}`);
			if (props.init) {
				props.init(client);
			}
			client.commands.set(props.help.name, props);
			props.conf.aliases.forEach((alias: string) => {
				client.aliases.set(alias, props.help.name);
			});
			return false;
		} catch (e) {
			return `Unable to load command ${commandName}: ${e}`;
		}
	};

	// Clean text of various characters
	client.clean = (client: any, text: string) => {
		if (typeof (text) !== "string") {
			text = require("util").inspect(text, {
				depth: 0
			});
		}
		if (typeof (text) === "string") {
			text = text
				.replace(/`/g, "`" + String.fromCharCode(8203))
				.replace(/@/g, "@" + String.fromCharCode(8203))
				.replace(client.token, "TOKEN");
		}
		return text;
	};

	client.utils = {};
};