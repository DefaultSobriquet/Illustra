exports.run = async (client, message, args) => {
	if(!isNaN(args[0]) && parseInt(args[0]) > 0){
		await message.channel.send(`I'll be restarting in ${args[0]} seconds, if that's alright with you.`);
		client.setTimeout(() => {
			client.destroy();
			process.exit(0);
		}, args[0]*1000, client);
		return;
	}
	await message.channel.send("I'll be restarting now, if that's alright with you.");
	client.destroy();
	process.exit(0);
};
 
exports.conf = {
	aliases: ["die", "kill"],
	permLevel: 10,
	userRequires: ["SEND_MESSAGES"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "restart",
	category: "System",
	description: "Restart the bot.",
	usage: "restart",
	example: "restart"
};