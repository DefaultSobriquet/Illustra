module.exports = async (client) => {
	// Log that the bot is online and sets the status.
	console.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers with ${client.commands.size} commands.`);
	client.user.setActivity(`with ${client.guilds.cache.size} guilds.`, {type: "PLAYING"});
};
