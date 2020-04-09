exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {MessageEmbed} = require("discord.js");
	const {startCase, toLower} = require("lodash/string");
	
	const guild = message.guild;

	const embed = new MessageEmbed()
		.setTitle(guild.name)
		.setColor(guild.me.displayColor)
		.setDescription(`${guild.name} is a server with ${guild.verificationLevel.toLowerCase()} verification and ${guild.mfaLevel ? "" : "no"} MFA enabled.`)
		.setThumbnail(guild.iconURL())
		.addField("Owner", guild.owner.user.tag, true)
		.addField("Region", startCase(guild.region), true)
		.addField("Members", guild.memberCount, true)
		.addField("Text Channels", guild.channels.cache.filter((channel) => channel.type === "text").size, true)
		.addField("Voice Channels", guild.channels.cache.filter((channel) => channel.type === "voice").size, true)
		.addField("Categories", guild.channels.cache.filter((channel) => channel.type === "category").size, true)
		.addField("Online", guild.members.cache.filter((member) => member.presence.status !== "offline").size, true)
		.addField("Humans", guild.members.cache.filter((member) => !member.user.bot).size, true)
		.addField("Bots", guild.members.cache.filter((member) => member.user.bot).size, true)
		.addField("Emotes", guild.emojis.cache.size, true)
		.addField("Roles", guild.roles.cache.size, true)
		.addField("Features", guild.features.length ? (guild.features.map(f => startCase(toLower(f))).join(", ").replace(/_/g, " ")) : "None", true)
		.setFooter(`Server ID ${guild.id} • Server created on ${guild.createdAt.toLocaleDateString()}`);
	
	message.channel.send(embed);
};

exports.conf = {
	aliases: ["guildinfo", "server"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "serverinfo",
	category: "Guild",
	description: "Display information about the server.",
	usage: "serverinfo",
	example: "serverinfo"
};
