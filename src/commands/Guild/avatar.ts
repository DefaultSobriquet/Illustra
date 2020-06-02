import {MessageEmbed, Message} from "discord.js";
export const run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	const member = client.utils.users.resolve(args[0], message);
	if (!member) return message.channel.send("I could not find a member matching that.");
	
	const embed = new MessageEmbed()
		.setTitle("Avatar")
		.setURL(member.user.displayAvatarURL())
		.setColor(message!.guild!.me!.displayColor || 0x2f3136)
		.setAuthor(member.user.tag, member.user.displayAvatarURL())
		.setImage(member.user.avatarURL({dynamic: true, size: 1024}));
	
	message.channel.send(embed);
};

export const conf = {
	aliases: ["av"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

export const help = {
	name: "avatar",
	category: "Guild",
	description: "Display a user's avatar.",
	usage: "avatar (user)",
	example: "avatar"
};
