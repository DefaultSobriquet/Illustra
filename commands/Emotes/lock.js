exports.run = async (client, message, args) => {
	const {MessageEmbed} = require("discord.js");
	const {resolve} = client.utils.emotes;
	const emote = resolve(args[0], message);

	let roles = args.slice(1).map((role) => client.utils.roles.resolve(role, message)).filter((role) => !role ? false : true);

	const integrated = message.guild.me.roles.cache.find((role) => role.managed);

	if (integrated) roles.push(integrated);
	roles = [...new Set(roles)];

	if (!emote) return message.channel.send("I could not find the emote provided.");

	const embed = new MessageEmbed()
		.setTitle(`Lock Emote [${emote.name}]`)
		.setTimestamp()
		.setImage(emote.url)
		.setColor(message.guild.me.displayColor)
		.setDescription(`**Roles**: ${roles.join(", ")}`)
		.setFooter(`${message.author.tag}`, message.author.avatarURL);

	await message.channel.send((integrated) ? "" : `Warning! ${client.config.name} does not have an integrated role and will no longer be able to use this emote.`, embed);

	emote.roles
		.set(roles)
		.then((emote) => message.channel.send(`> 🔒\t| [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
		.catch(() => message.channel.send("> There was a unexpected error."));
};

exports.conf = {
	aliases: ["restrict"],
	requires: ["SEND_MESSAGES", "MANAGE_EMOJIS", "MANAGE_MESSAGES", "ADD_REACTIONS"],
};

exports.help = {
	name: "lock",
	category: "Emotes",
	description: "Lock an emote to specific roles.",
	usage: "lock [emote] [...role]",
	example: "lock <:rooThink:511919341281738773> Pandas",
};
