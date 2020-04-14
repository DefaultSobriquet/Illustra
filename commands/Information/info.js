const {MessageEmbed} = require("discord.js");
exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const embed = new MessageEmbed()
		.setTitle(client.config.name)
		.setTimestamp()
		.setDescription(client.config.description)
		.setColor(message.guild.me.displayColor || 0x2f3136)
		.setThumbnail(client.user.displayAvatarURL())
		.addField("Users", client.users.cache.size, true)
		.addField("Servers", client.guilds.cache.size, true)
		.addField("Emotes", client.emojis.cache.size, true)
		.addField("Developer", client.config.owner, true)
		.addField("Language", "JavaScript", true)
		.addField("Library", "Discord.js", true)
		.addField("Invite", `[Bot Invite](${client.config.invite} 'Invite me!')`, true)
		.addField("Support", `[Server Invite](${client.config.support} 'To click or not to click.')`, true)
		.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
	message.channel.send((args.join(" ") === "コナミコマンド") ? `\`🔓\` | *Admin permissions granted, ${message.author.tag}!*` : "", embed);
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
