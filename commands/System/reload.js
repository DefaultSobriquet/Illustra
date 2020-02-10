exports.run = (client, message, args) => {
	if(!client.config.trusted.includes(message.author.id)) return;
	if(!args || args.length < 1) return message.channel.send("You must provide a command name to reload.");
	const commandName = args[0];
	// Check if the command exists and is valid
	if(!client.commands.has(commandName)) {
		return message.channel.send("That command does not exist!");
	}
	const commandCategory = client.commands.get(commandName).help.category; 
	// The path is relative to the current folder, so just ./filename.js
	delete require.cache[require.resolve(`../${commandCategory}/${commandName}.js`)];
	// We also need to delete and reload the command from the client.commands Enmap
	client.commands.delete(commandName);
	const props = require(`../${commandCategory}/${commandName}.js`);
	client.commands.set(commandName, props);
	message.channel.send(`The command ${commandName} has been reloaded!`);
};

exports.conf = {
	aliases: [],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "reload",
	category: "System",
	description: "Reload a command.",
	usage: "reload [command]",
	example: "reload ping"
};