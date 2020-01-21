exports.run = async (client, message, args) => {
	message.delete();
	message.channel.send(args.join(" "));
};
 
exports.conf = {
	aliases: ["speak"],
	permLevel: 0,
	userRequires: ["SEND_MESSAGES"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "say",
	category: "Entertainment",
	description: "Make the bot say something.",
	usage: "say",
	example: "say"
};