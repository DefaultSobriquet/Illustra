exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {MessageEmbed} = require("discord.js");
	const {release} = require("os");
	const embed = new MessageEmbed()
		.setTitle("System Information")
		.setTimestamp()
		.addField("OS", `${process.platform}-${process.arch} (${release()})`, true)
		.addField("Node", `${process.release.name}-${process.version}`, true)
		.setColor(message.guild.me.displayColor)
		.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
	message.channel.send(embed);
};

exports.conf = {
	aliases: ["sys"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "system",
	category: "Information",
	description: "Display system information about the bot.",
	usage: "system",
	example: "system"
};
