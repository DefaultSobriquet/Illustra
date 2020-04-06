exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const _ = require("lodash/array");
	const {MessageEmbed} = require("discord.js");
	const {resolve} = client.utils.emotes;
	
	const emote = resolve(args[0], message);

	if (!emote) return message.channel.send("I could not find the emote provided.");

	let roles = args.slice(1).map((role) => client.utils.roles.resolve(role, message)).filter((role) => !role ? false : true);
	const integrated = message.guild.me.roles.cache.find((role) => role.managed);
	
	if (integrated) roles.push(integrated);
	roles = _.uniq(roles);
	

	const embed = new MessageEmbed()
		.setTitle(`Lock Emote [${emote.name}]`)
		.setTimestamp()
		.setImage(emote.url)
		.setColor(message.guild.me.displayColor)
		.setDescription(`**Roles**: ${roles.join(", ")}`)
		.setFooter(`${message.author.tag}`, message.author.avatarURL());

	await message.channel.send((integrated) ? "" : `Warning! ${client.config.name} does not have an integrated role and will no longer be able to use this emote.`, embed);

	emote.roles
		.set(roles)
		.then((emote) => message.channel.send(`🔒\t| [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
		.catch((err) => {
			console.log(err);
			message.channel.send("There was a unexpected error.");
		});
};

exports.conf = {
	aliases: ["restrict"],
	perms: ["MANAGE_EMOJIS", "MANAGE_ROLES"], 
	requires: ["SEND_MESSAGES", "MANAGE_EMOJIS", "EMBED_LINKS"]
};

exports.help = {
	name: "lock",
	category: "Emotes",
	description: "Lock an emote to specific roles.",
	usage: "lock [emote] [...role]",
	example: "lock :rooThink: Pandas"
};
