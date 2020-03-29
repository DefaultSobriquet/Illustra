// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
	const msg = await message.channel.send("Pong!");
	msg.edit(`Pong! \`${msg.createdTimestamp - message.createdTimestamp}ms\``);
};

exports.conf = {
	aliases: ["latency"],
	requires: ["SEND_MESSAGES"],
};

exports.help = {
	name: "ping",
	category: "Information",
	description: "Check the bot and Discord's API latency.",
	usage: "ping",
	example: "ping",
};
