exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {embed, resolve} = client.utils.emotes;
	const emote = resolve(args[0], message);
	
	if (!emote) return message.channel.send("Please enter a valid emote.");
	
	await message.channel.send(embed(emote, message));
	
	emote
		.delete()
		.then((emote) => message.channel.send(`🗑️\t| [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
		.catch((err) => {
			console.log(err);
			message.channel.send("There was a unexpected error.");
		});
};

exports.conf = {
	aliases: ["delete", "del"],
	perms: ["MANAGE_EMOJIS"], 
	requires: ["SEND_MESSAGES", "EMBED_LINKS"]
};

exports.help = {
	name: "remove",
	category: "Emotes",
	description: "Remove an emote from the current guild.",
	usage: "remove [emote]",
	example: "remove :rooThink:"
};
