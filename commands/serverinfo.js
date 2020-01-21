exports.run = async (client, message) => {
	const { RichEmbed } = require("discord.js");
	const guild = await message.guild.fetchMembers();
	const veriLevel = ["non-existent","low","medium","high","maximum"];
	const embed = new RichEmbed()
		.setTitle(guild.name)
		.setColor(guild.me.displayColor)
		.setDescription(`${guild.name} is a server with ${veriLevel[guild.verificationLevel]} verification and ${guild.mfaLevel ? "" : "no"} MFA enabled.`)
		.setThumbnail(guild.iconURL)
		.addField("Owner",guild.owner.user.tag,true)
		.addField("Region",guild.region,true)
		.addField("Members",guild.memberCount,true)
		.addField("Text Channels",guild.channels.filter(channel => channel.type === "text").size,true)
		.addField("Voice Channels",guild.channels.filter(channel => channel.type === "voice").size,true)
		.addField("Categories",guild.channels.filter(channel => channel.type === "category").size,true)
		.addField("Online",guild.members.filter(member => member.presence.status !== "offline").size,true)
		.addField("Humans",guild.members.filter(member => !member.user.bot).size,true)
		.addField("Bots",guild.members.filter(member => member.user.bot).size,true)
		.addField("Emotes",guild.emojis.size,true)
		.addField("Roles",guild.roles.size,true)
		.addField("Features",guild.features.length ? guild.features.join(", ").replace(/_/g," ").replace(
			/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
		) : "None",true)
		.setFooter(`Requested by ${message.author.tag} • Server created on ${guild.createdAt.toLocaleDateString()}`);
	message.channel.send(embed);
};
 
exports.conf = {
	aliases: ["guildinfo"],
	permLevel: 0,
	userRequires: ["SEND_MESSAGES"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "serverinfo",
	category: "Guild",
	description: "Display information about the server.",
	usage: "serverinfo",
	example: "serverinfo"
};