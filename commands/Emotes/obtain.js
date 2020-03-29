exports.run = async (client, message, args, flags) => {
	const {extract, embed, props, obtain, menuGenerator, addable} = client.utils.emotes;
	const reactions = ["⏮️", "⬅️", "➡️", "⏭️", "💾", "📥", "🛑"];
	const allowGuild = flags.includes("guild") || flags.includes("server");


	if (!args[0] || !/^\d{17,19}$/.test(args[0])) return message.channel.send("Please enter a message ID!");
	const target = await message.channel.fetchMessage(args[0]).catch(() => {
		message.channel.send("I could not get that message.");
	});

	if (!target) return;

	const emotes = extract(target, allowGuild).map((emote) => props(emote));

	if (emotes.length === 0) return message.channel.send(`I couldn't find any ${allowGuild ? "" : "new"} emotes in that message.`);

	let page = 0;

	const menu = await message.channel.send(embed(emotes[page], target));
	const reactMenu = await menuGenerator(reactions, menu, message.author.id);

	reactMenu.on("collect", async (reaction, collector) => {
		if (reaction.emoji.name === "➡️" && page < emotes.length-1) menu.edit(embed(emotes[++page], target));
		if (reaction.emoji.name === "⬅️" && page > 0) menu.edit(embed(emotes[--page], target));
		if (reaction.emoji.name === "⏮️" && page !== 0) menu.edit(embed(emotes[page = 0], target));
		if (reaction.emoji.name === "⏭️" && page !== emotes.length-1) menu.edit(embed(emotes[page = emotes.length-1], target));
		if (reaction.emoji.name === "💾") {
			if (!addable([emotes[page]], message)) {
				collector.stop();
				return message.channel.send("You have reached the guild limit for emotes!");
			}
			obtain(emotes[page], message).then((emote) => {
				message.channel.send(`> ${emote}  | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``);
			}).catch((err) => {
				if (err.code === 50013) return message.channel.send("> There was a permissions error! Please make sure the correct permissions are granted.");
				message.channel.send(`> There was a unexpected error for ${emotes[page].name}! The emote may have been a legacy emote above 256KB.`);
				collector.stop();
			});
		}
		if (reaction.emoji.name === "📥") {
			const errored = [];
			if (!addable(emotes, message)) {
				message.channel.send(`> You don't have enough space for ${emotes.length} emotes!`);
			} else {
				const status = await message.channel.send("> Adding all emotes to guild...");
				for (const emote of emotes) {
					await obtain(emote, message).catch((err) => {
						errored.push(emote.name);
						if (err.code === 50013) return status.edit("> There was a permissions error! Please make sure the correct permissions are granted.");
						status.edit(`> There was a unexpected error for ${emote.name}! The emote may have been a legacy emote above 256KB.`);
					});
				}
				message.channel.send(errored.length ? `All emotes besides the following were added: \`${errored.join(", ")}\`.` : "All emotes were successfully added.");
				collector.stop();
			}
		}
		if (reaction.emoji.name === "🛑") collector.stop();
	});
};

exports.conf = {
	aliases: ["add"],
	requires: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_EMOJIS", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES", "ADD_REACTIONS"],
};

exports.help = {
	name: "obtain",
	category: "Emotes",
	description: "Add custom emotes from a message to the server.",
	usage: "obtain (message id)",
	example: "obtain 29394959239030102",
	flags: [
		{
			name: ["guild", "server"],
			use: "Allows obtaining emotes already in the server.",
		},
	],
};
