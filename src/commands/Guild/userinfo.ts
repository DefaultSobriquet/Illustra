import { MessageEmbed, GuildMember, Role } from "discord.js";
import {startCase, toLower} from "lodash";
import { ICommandContext } from "../../types";
import { Command } from "../../structures/Command";


const options = {
    name: "userinfo",
    description: "Display information about a user.",
    module: "Guild",
    usage: "(user)",
    examples: ["Sobriquet"],
    aliases: ["whois"],
    userPerms: [],
    botPerms: ["SEND_MESSAGES"]
}

class Userinfo extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const keyPerms = ["ADMINISTRATOR", "CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG", "MANAGE_MESSAGES", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
		const target = client.utils.users.resolve(ctx.args[0], ctx.message);
		
		if (!target) return ctx.channel.send("I could not find a member matching that.");
		
		const userPerms = keyPerms.filter((perm) => target.permissions.toArray().includes(perm)); // Filter by key permissions
		const roles = target.roles.cache.filter((role: Role) => !(role.id === role.guild.id)).map((role: Role) => role).sort((a: Role, b: Role) => b.position - a.position); // Sort by role position
		// @ts-ignore This needs to be fixed at some point.
		const members = [...ctx.guild!.members.cache.filter((member) => !member.user.bot).sort((a: GuildMember, b:GuildMember) => a!.joinedAt - b!.joinedAt)]; // Sort by join date 
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
			//@ts-ignore Fix this at some point.
			.addField("Status", status[target.user.presence.status], true)
			.addField("Client", target.presence.clientStatus ? startCase(Object.keys(target.presence.clientStatus).join(", ")) : "None", true)
			.addField(`Roles [${roles.length}]`, roles.length ? (roles.join(", ").length <= 1024 ? roles.join(", ") : "Too Many to Display.") : "None.")
			.addField("Permissions", userPerms.length ? userPerms.map(f => startCase(toLower(f))).join(", ").replace(/_/g, " ") : "")
			.setFooter(`Requested by ${ctx.user.tag} • User ID: ${target.user.id}`);
		
		ctx.channel.send(embed);
	}
}

export default Userinfo;