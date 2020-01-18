exports.run = async (client, message) => {
	const msg = await message.channel.send("Pong!");
	msg.edit(`Pong! Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\`. API Latency is \`${Math.round(client.ping)}ms\`.`);
	// Quotes to be added later!
};
 
exports.conf = {
	aliases: ["latency"],
	permLevel: 0,
	userRequires:["SEND_MESSAGES"],
	requires:["SEND_MESSAGES"]
};

exports.help = {
	name: "ping",
	category: "Information",
	description: "Check the bot and Discord's API latency.",
	usage: "ping",
	example: "ping"
};