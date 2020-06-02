import {MessageEmbed, Message} from "discord.js";
import {groupBy, toLower, startCase} from "lodash";

exports.run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	if (!args[0]) { // Check if there is no argument.
		const commands = groupBy(client.commands.array(), (cmd) => cmd.help.category);
		
		const embed = new MessageEmbed()
			.setTitle("Commands")
			.setTimestamp()
			.setColor(message!.guild!.me!.displayColor ?? 0x2f3136)
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
			.setColor(message!.guild!.me!.displayColor ?? 0x2f3136)
			.setDescription(command.help.description)
			.addField("Category", command.help.category, true)
			.addField("Aliases", command.conf.aliases.map((a: string) => `\`${a}\``).join(", ") || "None.", true)
			.addField("Usage", `\`\`\`${client.config.name} ${command.help.usage}\`\`\``)
			.addField("Example", `\`\`\`${client.config.name} ${command.help.example}\`\`\``)
			.addField("Permissions", `${command.conf.perms.map((p:string) => startCase(toLower(p))).join(", ") || "None."}`)
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
		
		message.channel.send(embed);
	}
};

export const conf = {
	aliases: [],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

export const help = {
	name: "help",
	category: "Information",
	description: "Explains what a command does.",
	usage: "help [command]",
	example: "help ping"
};