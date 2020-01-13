// eslint-disable-next-line no-undef
module.exports = async (client, message) => {
	// Prevent execution by bots and checks for messages without the prefix.
	if (message.author.bot || !message.content.startsWith(client.config.sets.prefix)) return;
  
	// Create arguments and command from message.
	const args = message.content.slice(client.config.sets.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
  
	// Fetches the user.
	if (message.guild && !message.member) await message.guild.fetchMember(message.author);
  
	// Get the level.
	const level = client.permlevel(message);
  
	// Retrieve command
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  
	if (!cmd) {
		message.channel.send("That command doesn't exist!");
		return;
	}
  
	if (level < client.levelCache[cmd.conf.permLevel]) {
		message.channel.send("You don't have permissions to run this command.");
		return;
	}

	const missingPerms = message.guild.me.permissions.missing(cmd.conf.requires);

	if (missingPerms.length > 0){
		message.member.createDM().then(c => c.send({
			embed:{
				title:"Missing Permissions",
				timestamp:new Date().toISOString(),
				color:message.guild.me.displayColor,
				description:`I do not have adequate permissions to run the command \`${cmd.help.name}\`.\nPlease grant me: \`${missingPerms.join(", ")}\``
			}
		})).catch((err) => console.log(err));
		return;
	}


	message.author.permLevel = level;
	console.log(`(${client.config.permLevels.find(l => l.level === level).level}) | ${message.author.username} [${message.author.id}] ran command ${cmd.help.name}.`);
	cmd.run(client, message, args, level);
};