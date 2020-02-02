// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
	message.delete().catch();
	message.channel.send(args.join(" "));
};
 
exports.conf = {
	aliases: ["speak"],
	requires: ["SEND_MESSAGES", "MANAGE_MESSAGES"]
};

exports.help = {
	name: "say",
	category: "Entertainment",
	description: "Make the bot say something.",
	usage: "say",
	example: "say"
};