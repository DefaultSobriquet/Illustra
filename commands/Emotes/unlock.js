exports.run = async (client, message, args) => {
	const {MessageEmbed} = require("discord.js");
	const {resolve} = client.utils.emotes;
	const emote = resolve(args[0], message);
	if (!emote) return message.channel.send("I could not find the emote provided.");
	//if (emote.roles.cache.size === 0) return message.channel.send(`> ${emote}  | There are no roles bound to \`\`${emote.name}\`\`!`);

	const embed = new MessageEmbed()
		.setTitle(`Unlock Emote [${emote.name}]`)
		.setTimestamp()
		.setDescription(`**Current Roles**: ${emote.roles.cache.map((role) => `${role}`).join(", ")}`)
		.setImage(emote.url)
		.setColor(message.guild.me.displayColor)
		.setFooter(`${message.author.tag}`, message.author.avatarURL());

	await message.channel.send(embed);
	emote.roles.set([])
		.then((emote) => message.channel.send(`🔓\t| [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
		.catch((err) => {
			console.log(err);
			message.channel.send("There was a unexpected error.");
		});
};

exports.conf = {
	aliases: ["unrestrict"],
	requires: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"]
};

exports.help = {
	name: "unlock",
	category: "Emotes",
	description: "Lock an emote to specific roles.",
	usage: "unlock [emote]",
	example: "unlock <:rooThink:511919341281738773>"
};
