import {MessageEmbed, Message } from "discord.js";
import {release} from "os";
exports.run = async (client: any, message: Message, args: string[], flags: string[]) => { // eslint-disable-line no-unused-vars
	const embed = new MessageEmbed()
		.setTitle("System Information")
		.setTimestamp()
		.addField("OS", `${process.platform}-${process.arch} (${release()})`, true)
		.addField("Node", `${process.release.name}-${process.version}`, true)
		.setColor(message!.guild!.me!.displayColor || 0x2f3136)
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