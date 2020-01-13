exports.run = async (client, message) => {
	message.channel.send({
		embed:{
			title:client.config.name,
			description:client.config.description,
			color:message.guild.me.displayColor,
			thumbnail:{
				url:client.user.avatarURL
			},
			fields:[{
				name:"Users",
				value:client.users.size,
				inline:true
			},{
				name:"Servers",
				value:client.guilds.size,
				inline:true
			},{
				name:"Developer",
				value:client.config.owner,
				inline:true
			},{
				name:"Language",
				value:"JavaScript",
				inline:true
			},{
				name:"Library",
				value:"Discord.js",
				inline:true
			}]
		}
	});
};
 
exports.conf = {
	aliases: ["about","information"],
	permLevel: 0,
	requires:["SEND_MESSAGES"]
};

exports.help = {
	name: "info",
	category: "Information",
	description: "Display information about the bot.",
	usage: "info",
	example: "info"
};