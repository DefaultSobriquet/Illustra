exports.run = async (client, message, args, flags) => { // eslint-disable-line no-unused-vars
	const {MessageEmbed} = require("discord.js");
	const {startCase, toLower} = require("lodash/string");
	
	const keyPerms = ["ADMINISTRATOR", "CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG", "MANAGE_MESSAGES", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
	const target = client.utils.users.resolve(args[0], message);
	
	if (!target) return message.channel.send("I could not find a member matching that.");
	
	const userPerms = keyPerms.filter((perm) => target.permissions.toArray().includes(perm)); // Filter by key permissions
	const roles = target.roles.cache.filter((role) => !(role.id === role.guild.id)).map((role) => role).sort((a, b) => b.position - a.position); // Sort by role position
	const members = [...message.guild.members.cache.filter((member) => !member.user.bot).sort((a, b) => a.joinedAt - b.joinedAt)]; // Sort by join date
	const position = members.findIndex((user) => user[0] === target.id)+1;
	const status = {"online": "Online", "idle": "Idle", "offline": "Offline", "dnd": "Do Not Disturb"};

	const embed = new MessageEmbed()
		.setTimestamp()
		.setAuthor(target.user.tag, target.user.displayAvatarURL())
		.setThumbnail(target.user.displayAvatarURL({dynamic: true}))
		.setColor(target.displayColor)
		.setDescription(target)
		.addField("Joined", target.joinedAt.toLocaleString(), true)
		.addField("Position", position || "None", true)
		.addField("Registered", target.user.createdAt.toLocaleString(), true)
		.addField("Presence", target.presence.activities[0] ? target.presence.activities[0].name : "None", true)
		.addField("Status", status[target.user.presence.status], true)
		.addField("Client", target.presence.clientStatus ? startCase(Object.keys(target.presence.clientStatus).join(", ")) : "None", true)
		.addField(`Roles [${roles.length}]`, roles.length ? (roles.join(", ").length <= 1024 ? roles.join(", ") : "Too Many to Display.") : "None.")
		.addField("Permissions", userPerms.length ? userPerms.map(f => startCase(toLower(f))).join(", ").replace(/_/g, " ") : "")
		.setFooter(`Requested by ${message.author.tag} • User ID: ${target.user.id}`);
	
	message.channel.send(embed);
};

exports.conf = {
	aliases: ["whois"],
	perms: [], 
	requires: ["SEND_MESSAGES"]
};

exports.help = {
	name: "userinfo",
	category: "Guild",
	description: "Display information about a user.",
	usage: "userinfo (user)",
	example: "userinfo"
};
