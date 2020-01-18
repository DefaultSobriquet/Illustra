exports.run = async (client, message) => {
	message.channel.send({
		embed:{
			title:"Uptime",
			color:message.guild.me.displayColor,
			timestamp:new Date().toISOString(),
			description:`${client.utils.msFormat(client.uptime)}`,
			footer:{
				text:`Started on ${client.readyAt.toLocaleString()}`
			}
		}
	});
};
  
exports.conf = {
	aliases: ["up"],
	permLevel: 0,
	userRequires:["SEND_MESSAGES"],
	requires:["SEND_MESSAGES"]
};
  
exports.help = {
	name: "uptime",
	category: "Information",
	description: "Displays how long the bot has been up.",
	usage: "uptime",
	example: "uptime"
};