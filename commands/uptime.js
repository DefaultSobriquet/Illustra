exports.run = async (client, message) => {
	const { RichEmbed } = require("discord.js");
	const embed = new RichEmbed()
		.setTitle("Uptime")
		.setColor(message.guild.me.displayColor)
		.setTimestamp()
		.setDescription(`${client.config.name} has been online for ${client.utils.msFormat(client.uptime)}.`)
		.setFooter(`PID ${process.pid} | Started on ${client.readyAt.toLocaleString()}`);
	message.channel.send(embed);
};
  
exports.conf = {
	aliases: ["up"],
	requires: ["SEND_MESSAGES"]
};
  
exports.help = {
	name: "uptime",
	category: "Information",
	description: "Displays how long the bot has been up.",
	usage: "uptime",
	example: "uptime"
};