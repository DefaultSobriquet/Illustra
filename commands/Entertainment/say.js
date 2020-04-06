exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	message.delete().catch();
	message.channel.send(args.join(" ")).catch();
};

exports.conf = {
	aliases: ["speak", "echo"],
	perms: ["MANAGE_MESSAGES"], 
	requires: ["SEND_MESSAGES", "MANAGE_MESSAGES"]
};

exports.help = {
	name: "say",
	category: "Entertainment",
	description: "Make the bot say something.",
	usage: "say",
	example: "say"
};
