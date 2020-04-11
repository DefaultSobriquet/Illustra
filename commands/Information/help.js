exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {MessageEmbed} = require("discord.js");
	const {groupBy, toLower, startCase} = require("lodash");


	if (!args[0]) { // Check if there is no argument.
		const commands = groupBy(client.commands.array(), (cmd) => cmd.help.category);
		
		const embed = new MessageEmbed()
			.setTitle("Commands")
			.setTimestamp()
			.setColor(message.guild.me.displayColor)
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

		for(const category in commands){
			const cmds = commands[category];
			embed.addField(category, cmds.map(cmd => `\`${cmd.help.name}\` - ${cmd.help.description}`).join("\n"));
		}

		message.channel.send(embed);

	}else{

		const search = args[0].toLowerCase(); // Take the first argument as a search term.
		const command = client.commands.get(search) || client.commands.get(client.aliases.get(search)); // Attempt to retrieve search
		if (!command) return message.channel.send("I've never heard of that command before."); // If commmand doesn't exist, notify.
		const embed = new MessageEmbed()
			.setTitle(`Command: ${command.help.name}`)
			.setColor(message.guild.me.displayColor)
			.setDescription(command.help.description)
			.addField("Category", command.help.category, true)
			.addField("Aliases", command.conf.aliases.map((a) => `\`${a}\``).join(", ") || "None.", true)
			.addField("Usage", `\`\`\`${client.config.name} ${command.help.usage}\`\`\``)
			.addField("Example", `\`\`\`${client.config.name} ${command.help.example}\`\`\``)
			.addField("Permissions", `${command.conf.perms.map(p => startCase(toLower(p))).join(", ") || "None."}`)
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
		
		message.channel.send(embed);
	}
};

exports.conf = {
	aliases: [],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "help",
	category: "Information",
	description: "Explains what a command does.",
	usage: "help [command]",
	example: "help ping"
};
