// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args, flags) => {
	const msg = await message.channel.send("Pong!");
	msg.edit(`Pong! Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\`. API Latency is \`${Math.round(client.ping)}ms\`.`);
};
 
exports.conf = {
	aliases: ["latency"],
	permLevel: 0,
	userRequires: ["SEND_MESSAGES"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "ping",
	category: "Information",
	description: "Check the bot and Discord's API latency.",
	usage: "ping",
	example: "ping",
	flags: [
		{
			name: "quote",
			use: "Adds a quote to your ping!"
		}
	]
};