import { Message, MessageEmbed } from "discord.js";
import ms from "ms";
exports.run = async (client: any, message: Message, args:string[], flags:string[]) => { // eslint-disable-line no-unused-vars
	const embed = new MessageEmbed()
		.setTitle("Uptime")
		.setColor(message!.guild!.me!.displayColor || 0x2f3136)
		.setTimestamp()
		.setDescription(`${client.config.name} has been online for ${ms(client.uptime, {long: true})}.`)
		.setFooter(`PID ${process.pid} | Started on ${client.readyAt.toLocaleString()}`);
		
	message.channel.send(embed);
};

exports.conf = {
	aliases: ["up"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "uptime",
	category: "Information",
	description: "Displays how long the bot has been up.",
	usage: "uptime",
	example: "uptime"
};
