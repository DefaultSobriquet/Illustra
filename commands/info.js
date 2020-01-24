exports.run = async (client, message) => {
	const { RichEmbed } = require("discord.js");
	const embed = new RichEmbed()
		.setTitle(client.config.name)
		.setTimestamp()
		.setDescription(client.config.description)
		.setColor(message.guild.me.displayColor)
		.setThumbnail(client.user.avatarURL)
		.addField("Users", client.users.size, true)
		.addField("Servers", client.guilds.size, true)
		.addField("Developer", client.config.owner, true)
		.addField("Language", "JavaScript", true)
		.addField("Library", "Discord.js", true)
		.addField("Invite", `[Click Here!](${client.config.invite})`, true)
		.addField("Support", `[Get help!](${client.config.support})`, true)
		.setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL);
	message.channel.send(embed);
};
 
exports.conf = {
	aliases: ["about", "information"],
	permLevel: 0,
	userRequires: ["SEND_MESSAGES"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "info",
	category: "Information",
	description: "Display information about the bot.",
	usage: "info",
	example: "info"
};