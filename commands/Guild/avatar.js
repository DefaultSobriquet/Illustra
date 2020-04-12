const {MessageEmbed} = require("discord.js");
exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const member = client.utils.users.resolve(args[0], message);
	if (!member) return message.channel.send("I could not find a member matching that.");
	
	const embed = new MessageEmbed()
		.setTitle("Avatar")
		.setURL(member.user.displayAvatarURL())
		.setColor(message.guild.me.displayColor)
		.setAuthor(member.user.tag, member.user.displayAvatarURL())
		.setImage(member.user.avatarURL({dynamic: true, size: 1024}));
	
	message.channel.send(embed);
};

exports.conf = {
	aliases: ["av"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "avatar",
	category: "Guild",
	description: "Display a user's avatar.",
	usage: "avatar (user)",
	example: "avatar"
};
