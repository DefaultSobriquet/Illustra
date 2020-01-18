exports.run = async (client, message, args) => {
	if(!args[0]){ // Check if there is no argument.
		let commands = client.commands.array().sort((a,b) => a.help.category > b.help.category); // Sort commands by category.
		let category = "";
		let cmdList = "";
		commands.forEach(cmd => {
			if(cmd.conf.permLevel > client.permlevel(message)) return;
			if(cmd.help.category !== category){
				cmdList+=`**${cmd.help.category}**\n`;
				category = cmd.help.category;
			}
			cmdList+=`\`${cmd.help.name}\` - ${cmd.help.description}\n`;
		});
		message.channel.send({
			embed:{
				title:"Commands",
				description:cmdList,
				timestamp:new Date().toISOString(),
				color:message.guild.me.displayColor,
				footer: {
					text: `Requested by ${message.author.tag}`,
					icon_url:message.author.avatarURL
				}	
			}
		});
	}else{
		const search = args[0].toLowerCase(); // Take the first argument as a search term.
		const command = client.commands.get(search) || client.commands.get(client.aliases.get(search)); // Attempt to retrieve search
		if(!command) return message.channel.send("That command doesn't exist."); // If commmand doesn't exist, notify.
		message.channel.send({
			embed:{
				title:`Command: ${command.help.name}`,
				color:message.guild.me.displayColor,
				description:`**Description: **${command.help.description}\n**Usage:** \`${client.config.sets.prefix}${command.help.usage}\`\n`
			}
		});
	}
};
  
exports.conf = {
	aliases: [],
	permLevel: 0,
	userRequires:["SEND_MESSAGES"],
	requires:["SEND_MESSAGES"]
};
  
exports.help = {
	name: "help",
	category: "Information",
	description: "Explains what a command does.",
	usage: "help [command]",
	example: "help ping"
};