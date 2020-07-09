import { MessageEmbed, GuildMember, Role, PermissionString } from "discord.js";
import {startCase, toLower} from "lodash";
import { ICommandContext } from "../../types";
import { Command } from "../../structures/Command";
import IllustraClient from "../../structures/IllustraClient";
import { CommandResponse } from "../../structures/CommandResponse";


const options: Partial<Command> = {
    name: "userinfo",
    description: "Display information about a user.",
    module: "Guild",
    usage: "(user)",
    examples: ["Sobriquet"],
    aliases: ["whois"],
    userPerms: [],
    botPerms: ["SEND_MESSAGES"]
};

class Userinfo extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const keyPerms: PermissionString[] = 
			["ADMINISTRATOR", "CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS",
			 "MANAGE_GUILD", "VIEW_AUDIT_LOG", "MANAGE_MESSAGES", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "MUTE_MEMBERS",
			 "DEAFEN_MEMBERS", "MOVE_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
			
		
		const target = Illustra.utils.user.resolve(ctx.args[0], ctx.message);
		
		if (!target){
			ctx.channel.send("I could not find a member matching that.");
			return new CommandResponse();
		}
		
		const userPerms = keyPerms.filter((perm) => target.permissions.toArray().includes(perm)); // Filter by key permissions
		const roles = target.roles.cache.filter((role: Role) => !(role.id === role.guild.id)).map((role: Role) => role).sort((a: Role, b: Role) => b.position - a.position); // Sort by role position
		
		const members = [...ctx.guild!.members.cache.filter((member) => !member.user.bot).sort((a: GuildMember, b:GuildMember) => a.joinedTimestamp! - b.joinedTimestamp!)]; // Sort by join date 
		const position = members.findIndex((user) => user[0] === target.id)+1;
		const status = {"online": "Online", "idle": "Idle", "offline": "Offline", "dnd": "Do Not Disturb", "invisible": "Invisible"};

		const embed = new MessageEmbed()
			.setTimestamp()
			.setAuthor(target.user.tag, target.user.displayAvatarURL())
			.setThumbnail(target.user.displayAvatarURL({dynamic: true}))
			.setColor(target.displayColor)
			.setDescription(target)
			.addField("Joined", target.joinedAt!.toLocaleString(), true)
			.addField("Position", position || "None", true)
			.addField("Registered", target.user.createdAt.toLocaleString(), true)
			.addField("Presence", target.presence.activities[0]?.name ?? "None", true)
			.addField("Status", status[target.user.presence.status], true)
			.addField("Client", target.presence.clientStatus ? startCase(Object.keys(target.presence.clientStatus).join(", ")) : "None", true)
			.addField(`Roles [${roles.length}]`, roles.length ? (roles.join(", ").length <= 1024 ? roles.join(", ") : "Too Many to Display.") : "None.")
			.addField("Permissions", userPerms.length ? userPerms.map(f => startCase(toLower(f))).join(", ").replace(/_/g, " ") : "")
			.setFooter(`Requested by ${ctx.user.tag} • User ID: ${target.user.id}`);
		
		ctx.channel.send(embed);

		return new CommandResponse();
	}
}

export default Userinfo;