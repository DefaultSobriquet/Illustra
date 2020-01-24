// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
	const { RichEmbed } = require("discord.js");
	const keyPerms = ["ADMINISTRATOR", "CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG", "MANAGE_MESSAGES", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
	const target = client.utils.users.resolve(args[0], message);
	if(!target) return message.channel.send("I could not find a member matching that.");
	const roles = target.roles.filter(role => !(role.id === role.guild.defaultRole.id)).map(role => role).sort((a, b) => b.position - a.position);
	const members = [...message.guild.members.filter(member => !member.user.bot).sort((a, b) => a.joinedAt - b.joinedAt)];
	const position = members.findIndex(user => user[0] === target.id)+1;
	const embed = new RichEmbed()
		.setTimestamp()
		.setAuthor(target.user.tag, target.user.avatarURL)
		.setThumbnail(target.user.avatarURL)
		.setColor(target.displayColor)
		.setDescription(target)
		.addField("Joined", target.joinedAt.toLocaleString(), true)
		.addField("Position", position ? position : "None", true)
		.addField("Registered", target.user.createdAt.toLocaleString(), true)
		.addField("Presence", target.user.presence.game ? `${["Playing ", "Streaming ", "Listening to ", "Watching ", ""][target.user.presence.game.type]}${target.user.presence.game.name}` : "None", true)
		.addField("Status", {"online": "Online", "idle": "Idle", "offline": "Offline", "dnd": "Do Not Disturb"}[target.user.presence.status], true)
		.addField("Client", target.user.presence.clientStatus ? Object.keys(message.author.presence.clientStatus).map(client => ({"web": "Web", "desktop": "Desktop", "mobile": "Mobile"}[client])).join(", ") : "None", true)
		.addField(`Roles [${roles.length}]`, roles.length ? roles.join(", ") : "None.")
		.addField("Permissions", keyPerms.filter(perm => target.permissions.toArray().includes(perm)).join(", ").replace(/_/g, " ").replace(
			/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
		.setFooter(`ID: ${target.user.id}`);
	message.channel.send(embed);
};
 
exports.conf = {
	aliases: ["whois"],
	permLevel: 0,
	userRequires: ["SEND_MESSAGES"],
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "userinfo",
	category: "Guild",
	description: "Display information about a user.",
	usage: "userinfo (user)",
	example: "userinfo"
};