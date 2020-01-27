// eslint-disable-next-line no-undef
module.exports = async (client, message) => {
	const { RichEmbed } = require("discord.js");

	// Prevent execution by bots and checks for messages without the prefix.
	if (message.author.bot || !message.content.startsWith(client.config.sets.prefix)) return;
  
	// Create arguments and command from message.
	const input = message.content.slice(client.config.sets.prefix.length).trim();
	const args = input.split(/ +/g).filter(arg => !arg.startsWith("--"));
	const flags = input.split(/ +/g).filter(arg => arg.startsWith("--")).map(flag => flag.replace("--", ""));

	const command = args.shift().toLowerCase();
  
	// Fetches the user.
	if (message.guild && !message.member) await message.guild.fetchMember(message.author);
  
	// Retrieve command
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  
	if (!cmd) return;

	const missingPerms = message.channel.memberPermissions(client.user).missing(cmd.conf.requires);

	const embed = new RichEmbed()
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
	cmd.run(client, message, args, flags);
};