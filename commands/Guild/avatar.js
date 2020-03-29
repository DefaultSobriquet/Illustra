// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
	const {MessageEmbed} = require("discord.js");
	const member = client.utils.users.resolve(args[0], message);
	if (!member) return message.channel.send("I could not find a member matching that.");
	const embed = new MessageEmbed()
		.setTitle("Avatar")
		.setColor(message.guild.me.displayColor)
		.setAuthor(member.user.tag, member.user.avatarURL())
		.setImage(member.user.avatarURL({format: "png", dynamic: true, size: 1024}));
	message.channel.send(embed);
};

exports.conf = {
	aliases: ["av"],
	requires: ["SEND_MESSAGES"],
};

exports.help = {
	name: "avatar",
	category: "Guild",
	description: "Display a user's avatar.",
	usage: "avatar (user)",
	example: "avatar",
};
