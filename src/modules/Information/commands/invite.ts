import {MessageEmbed} from "discord.js";
import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";

const options: Partial<Command> = {
	name: "invite",
	description: "Posts an invite for the bot.",
	usage: "",
	examples: [""],
	aliases: ["inv"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
};

class Invite extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const embed = new MessageEmbed()
		.setTitle(Illustra.config.name)
		.setTimestamp()
		.setDescription("Here are a list of invite links.")
		.addField("Invite", `[Bot Invite](${Illustra.config.invite} 'Invite me!')`, true)
		.addField("Support", `[Server Invite](${Illustra.config.support} 'To click or not to click.')`, true)
		.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());

		ctx.channel.send(embed);
		
		return new CommandResponse();
	}
}

export default Invite;