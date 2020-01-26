module.exports = async client => {
	// Log that the bot is online and sets the status.
	console.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers with ${client.commands.size} commands.`);
	(function statusChange(){
		const status = client.config.status; // Retrieve status from config
		const key = Math.floor(Math.random() * status.length);
		client.user.setActivity(status[key].text, {
			type: status[key].type
		});
		setTimeout(statusChange, 15000, client);
	})();
};