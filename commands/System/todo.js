exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	if (!client.config.trusted.includes(message.author.id)) return;

	if(!args[0]) return message.channel.send("Please enter a todo.");

	client.channels.cache.get("675015929330925572").send(`**${message.author.tag}**: ${args.join(" ")}`)
		.then(() => {
			message.react("success:691141985418870866").catch();
		}).catch(() => {
			message.react("failure:691142169565724672").catch();
		});

	message.delete({timeout: 5000}).catch();
};

exports.conf = {
	aliases: ["t", "note"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "todo",
	category: "System",
	description: "Saves a todo for Illustra.",
	usage: "todo [...todo]",
	example: "todo Add self-awareness."
};
