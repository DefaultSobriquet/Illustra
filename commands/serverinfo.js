exports.run = async (client, message) => {
	const guild = await message.guild.fetchMembers();
	const veriLevel = ["non-existent","low","medium","high","maximum"];
	message.channel.send({
		embed:{
			title:guild.name,
			color:guild.me.displayColor,
			description:`${guild.name} is a server with ${veriLevel[guild.verificationLevel]} verification and ${guild.mfaLevel ? "" : "no"} MFA enabled.`,
			thumbnail:{
				url:guild.iconURL
			},
			fields:[{
				name:"Owner",
				value:guild.owner.user.tag,
				inline:true
			},{
				name:"Region",
				value:guild.region,
				inline:true
			},{
				name:"Members",
				value:guild.memberCount,
				inline:true
			},{
				name:"Text Channels",
				value:guild.channels.filter(channel => channel.type === "text").size,
				inline:true
			},{
				name:"Voice Channels",
				value:guild.channels.filter(channel => channel.type === "voice").size,
				inline:true
			},{
				name:"Categories",
				value:guild.channels.filter(channel => channel.type === "category").size,
				inline:true
			},{
				name:"Online",
				value:guild.members.filter(member => member.presence.status !== "offline").size,
				inline:true
			},{
				name:"Humans",
				value:guild.members.filter(member => !member.user.bot).size,
				inline:true
			},{
				name:"Bots",
				value:guild.members.filter(member => member.user.bot).size,
				inline:true
			},{
				name:"Emotes",
				value:guild.emojis.size,
				inline:true
			},{
				name:"Roles",
				value:guild.roles.size,
				inline:true
			},{
				name:"Features",
				value:guild.features.length ? guild.features.join(", ").replace(/_/g," ").replace(
					/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
				) : "None",
				inline:true
			}],
			footer:{
				text:`Requested by ${message.author.tag} • Server created on ${guild.createdAt.toLocaleDateString()}`
			}
		}
	});
};
 
exports.conf = {
	aliases: ["guildinfo"],
	permLevel: 0,
	userRequires:["SEND_MESSAGES"],
	requires:["SEND_MESSAGES"]
};

exports.help = {
	name: "serverinfo",
	category: "Information",
	description: "Display information about the server.",
	usage: "serverinfo",
	example: "serverinfo"
};