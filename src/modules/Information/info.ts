import {MessageEmbed} from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import { CommandResponse } from "../../structures/CommandResponse";

const options: Partial<Command> = {
	name: "info",
	description: "Displays information about the bot.",
	module: "Information",
	usage: "",
	examples: [""],
	aliases: ["about", "information"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
};

class Info extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const embed = new MessageEmbed()
		.setTitle(Illustra.config.name)
		.setTimestamp()
		.setDescription(Illustra.config.description)
		.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
		.setThumbnail(Illustra.client.user!.displayAvatarURL())
		.addField("Users", Illustra.client.users.cache.size, true)
		.addField("Servers", Illustra.client.guilds.cache.size, true)
		.addField("Emotes", Illustra.client.emojis.cache.size, true)
		.addField("Developer", Illustra.config.owner, true)
		.addField("Language", "TypeScript", true)
		.addField("Library", "Discord.js", true)
		.addField("Version", Illustra.version, true)
		.addField("Invite", `[Bot Invite](${Illustra.config.invite} 'Invite me!')`, true)
		.addField("Support", `[Server Invite](${Illustra.config.support} 'To click or not to click.')`, true)
		.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());

		ctx.channel.send(embed);
		
		return new CommandResponse();
	}
}

export default Info;