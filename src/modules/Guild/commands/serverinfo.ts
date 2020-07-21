import {MessageEmbed} from "discord.js";
import {startCase, toLower} from "lodash";
import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";

const options: Partial<Command> = {
    name: "serverinfo",
    description: "Display information about the guild.",
    usage: "serverinfo",
    examples: [""],
    aliases: ["guildinfo", "server"],
    userPerms: [],
    botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
};

class Serverinfo extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const guild = ctx.guild!;

		const [humans, bots] = guild.members.cache.partition(member => !member.user.bot);

		const embed = new MessageEmbed()
			.setTitle(guild.name)
			.setColor(guild.me!.displayColor)
			.setDescription(`${guild.name} is a server with ${guild.verificationLevel === "NONE" ? guild.verificationLevel.toLowerCase() : "no"} verification and ${guild.mfaLevel ? "" : "no"} MFA enabled.`)
			.setThumbnail(guild.iconURL() ?? "")
			.addField("Owner", guild.owner!.user.tag, true)
			.addField("Region", startCase(guild.region), true)
			.addField("Members", guild.memberCount, true)
			.addField("Text Channels", guild.channels.cache.filter((channel) => channel.type === "text").size, true)
			.addField("Voice Channels", guild.channels.cache.filter((channel) => channel.type === "voice").size, true)
			.addField("Categories", guild.channels.cache.filter((channel) => channel.type === "category").size, true)
			.addField("Online", guild.members.cache.filter((member) => member.presence.status !== "offline").size, true)
			.addField("Humans", humans.size, true)
			.addField("Bots", bots.size, true)
			.addField("Emotes", guild.emojis.cache.size, true)
			.addField("Roles", guild.roles.cache.size, true)
			.addField("Features", guild.features.length ? (guild.features.map(f => startCase(toLower(f))).join(", ").replace(/_/g, " ")) : "None", true)
			.setFooter(`Server ID ${guild.id} • Server created on ${guild.createdAt.toLocaleDateString()}`);
	
		ctx.channel.send(embed);

		return new CommandResponse();
	}
}

export default Serverinfo;