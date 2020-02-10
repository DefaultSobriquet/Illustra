exports.run = async (client, message, args) => {
	const { embed, resolve, menuGenerator } = client.utils.emotes;
	const emote = resolve(args[0], message);
	if(!emote) return message.channel.send("Please enter a valid emote.");
	const menu = await message.channel.send(embed(emote, message));
	const reactions = ["🗑️", "🛑"];
	const reactMenu = await menuGenerator(reactions, menu, message.author.id);
	reactMenu.on("collect", (reaction, collector) => {
		if(reaction.emoji.name === "🗑️") emote.delete(`Deleted by ${message.author.tag}`)
			.then(() => message.channel.send("> Emote succesfully deleted."))
			.catch(() => message.channel.send("> There was an issue deleting that emote!"));
		collector.stop();
	});
};

exports.conf = {
	aliases: ["delete"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "remove",
	category: "Emotes",
	description: "Remove an emote from the current guild.",
	usage: "remove [emote]",
	example: "remove :rooThink:"
};