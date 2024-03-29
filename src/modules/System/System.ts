import {MessageEmbed} from "discord.js";
import {release} from "os";
import { ICommandContext } from "../../types";
import { Command } from "../../structures/Command";
import IllustraClient from "../../structures/IllustraClient";
import { CommandResponse } from "../../structures/CommandResponse";

const options: Partial<Command> = {
	name: "system",
	description: "Display system information about the bot.",
	usage: "",
	examples: [""],
	aliases: ["sys"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
};

class System extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const embed = new MessageEmbed()
			.setTitle("System Information")
			.setTimestamp()
			.addField("OS", `${process.platform}-${process.arch} (${release()})`, true)
			.addField("Node", `${process.release.name}-${process.version}`, true)
			.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
			.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL());

		ctx.channel.send(embed);

		return new CommandResponse();
	}
}

export default System;