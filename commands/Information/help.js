exports.run = async (client, message, args) => {
	const {MessageEmbed} = require("discord.js");

	if (!args[0]) { // Check if there is no argument.
		const commands = client.commands.array().sort((a, b) => a.help.category > b.help.category ? 1 : a.help.name > b.help.name && a.help.category === b.help.category ? 1 : -1); // Sort commands by category.
		let category = "";
		let cmdList = "";

		commands.forEach((cmd) => {
			if (cmd.help.category !== category) {
				cmdList+=`**${cmd.help.category}**\n`;
				category = cmd.help.category;
			}
			cmdList+=`\`${cmd.help.name}\` - ${cmd.help.description}\n`;
		});

		const embed = new MessageEmbed()
			.setTitle("Commands")
			.setDescription(cmdList)
			.setTimestamp()
			.setColor(message.guild.me.displayColor)
			.setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL);

		message.author.send(embed);
	} else {
		const search = args[0].toLowerCase(); // Take the first argument as a search term.
		const command = client.commands.get(search) || client.commands.get(client.aliases.get(search)); // Attempt to retrieve search
		if (!command) return message.channel.send("That command doesn't exist."); // If commmand doesn't exist, notify.
		const embed = new MessageEmbed()
			.setTitle(`Command: ${command.help.name}`)
			.setColor(message.guild.me.displayColor)
			.setDescription(`**Description: **${command.help.description}\n**Usage:** \`${client.config.sets.prefix}${command.help.usage}\`\n**Example:** \`${client.config.sets.prefix}${command.help.example}\`\n**Aliases**: ${command.conf.aliases.length !== 0 ? command.conf.aliases.map((alias) => `\`${client.config.sets.prefix}${alias}\``).join(", ") : "None."}`);
		message.channel.send(embed);
	}
};

exports.conf = {
	aliases: [],
	requires: ["SEND_MESSAGES"],
};

exports.help = {
	name: "help",
	category: "Information",
	description: "Explains what a command does.",
	usage: "help [command]",
	example: "help ping",
	flags: [
		{
			name: ["guild", "noDM", "server"],
			use: "Sends the full help embed in the guild.",
		},
	],
};
