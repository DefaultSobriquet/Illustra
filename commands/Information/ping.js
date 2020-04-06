exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const msg = await message.channel.send("Pong!");
	msg.edit(`Pong! \`${msg.createdTimestamp - message.createdTimestamp}ms\``);
};

exports.conf = {
	aliases: ["latency", "pong"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "ping",
	category: "Information",
	description: "Check the bot and Discord's API latency.",
	usage: "ping",
	example: "ping"
};
