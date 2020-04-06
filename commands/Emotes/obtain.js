exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {extract, props} = client.utils.emotes;

	if (!args[0] || !/^\d{17,19}$/.test(args[0])) return message.channel.send("Please enter a message ID!");

	const target = await message.channel.messages.fetch(args[0], true)
		.catch(() => {
			message.channel.send("I could not get that message.");
		});

	if (!target) return;

	const emotes = extract(target).map((emote) => props(emote));

	const status = await message.channel.send(emotes.length ? `Adding ${emotes.length} emotes to the guild.` : "I couldn't find any emotes!");

	for (const emote of emotes) {
		await message.guild.emojis.create(emote.url, emote.name, {reason: `Obtained by ${message.author.tag}`})
			.catch((err) => {
				console.log(err);
				status.edit(`There was a unexpected error for ${emote.name}! The emote may have been a legacy emote above 256KB.`);
			});
	}
};

exports.conf = {
	aliases: ["steal"],
	perms: ["MANAGE_EMOJIS"], 
	requires: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_EMOJIS", "READ_MESSAGE_HISTORY"]
};

exports.help = {
	name: "obtain",
	category: "Emotes",
	description: "Add custom emotes from a message to the server.",
	usage: "obtain (message id)",
	example: "obtain 29394959239030102"
};
