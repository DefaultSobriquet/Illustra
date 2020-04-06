exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {MessageEmbed} = require("discord.js");
	const embed = new MessageEmbed()
		.setTitle(client.config.name)
		.setTimestamp()
		.setDescription(client.config.description)
		.setColor(message.guild.me.displayColor)
		.setThumbnail(client.user.avatarURL())
		.addField("Users", client.users.cache.size, true)
		.addField("Servers", client.guilds.cache.size, true)
		.addField("Developer", client.config.owner, true)
		.addField("Language", "JavaScript", true)
		.addField("Library", "Discord.js", true)
		.addField("Invite", `[Bot Invite](${client.config.invite})`, true)
		.addField("Support", `[Server Invite](${client.config.support})`, true)
		.setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL());
	message.channel.send(embed);
};

exports.conf = {
	aliases: ["about", "information"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "info",
	category: "Information",
	description: "Display information about the bot.",
	usage: "info",
	example: "info"
};
