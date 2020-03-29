// eslint-disable-next-line no-undef
module.exports = async (client, message) => {
	const {MessageEmbed} = require("discord.js");

	let prefix = client.config.sets.prefix;

	// Mention Prefix
	const prefixMention = new RegExp(`^<@!?${client.user.id}>`);
	prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : prefix;

	// Name Prefix
	prefix = message.content.startsWith(client.config.name) ? client.config.name : prefix;

	// Prevent execution by bots and checks for messages without the prefix.
	if (message.author.bot || !message.content.startsWith(prefix)) return;

	// Create arguments and command from message.
	const input = message.content.slice(prefix.length).trim();
	const args = input.split(/ +/g);
	const command = args.shift().toLowerCase();

	// Fetches the user.
	if (message.guild && !message.member) await message.guild.fetch(message.author.id);

	// Retrieve command
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

	if (!cmd) return;

	const missingPerms = message.channel.permissionsFor(client.user).missing(cmd.conf.requires);

	const embed = new MessageEmbed()
		.setTitle("Missing Permissions")
		.setTimestamp()
		.setColor(message.guild.me.displayColor)
		.setDescription(`I do not have adequate permissions to run the command \`${cmd.help.name}\`.\nPlease grant me: \`${missingPerms.join(", ")}\``)
		.setFooter(`${message.guild.name} | Missing Permissions`, message.guild.iconURL);

	if (missingPerms.length > 0){
		message.author.send(embed).catch((err) => console.log(err));
		return;
	}

	console.log(`${message.author.username} [${message.author.id}] ran command ${cmd.help.name}.`);
	cmd.run(client, message, args);
};
