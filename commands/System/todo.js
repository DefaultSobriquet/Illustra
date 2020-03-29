exports.run = async (client, message, args) => {
	if (!client.config.trusted.includes(message.author.id)) return;
	client.channels.cache.get("675015929330925572").send(args.join(" "))
		.then(() => {
			message.react("success:691141985418870866").catch();
		},
		).catch(() => {
			message.react("failure:691142169565724672").catch();
		});
	message.delete({timeout: 5000}).catch();
};

exports.conf = {
	aliases: ["t", "note"],
	requires: ["SEND_MESSAGES"],
};

exports.help = {
	name: "todo",
	category: "System",
	description: "Saves a todo for Illustra.",
	usage: "todo [...todo]",
	example: "todo Add self-awareness.",
};
