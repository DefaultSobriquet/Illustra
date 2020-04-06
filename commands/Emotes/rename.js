exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {embed, resolve} = client.utils.emotes;
	const emote = resolve(args[0], message);
	if (!emote) return message.channel.send("I could not find the emote provided.");
	if (!/^[_a-z0-9]{2,32}$/i.test(args[1])) return message.channel.send("That is not a valid emote name!");
	emote
		.setName(args[1], `Renamed by ${message.author.tag}`)
		.then((emote) => {
			message.channel.send(embed(emote, message));
		}).catch((err) => {
			console.log(err);
			message.channel.send("There was an unexpected error!");
		});
};

exports.conf = {
	aliases: [],
	perms: ["MANAGE_EMOJIS"], 
	requires: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"]
};

exports.help = {
	name: "rename",
	category: "Emotes",
	description: "Rename an existing emote.",
	usage: "rename [emote] [name]",
	example: "emote :pandaThink: :rooThink:"
};
