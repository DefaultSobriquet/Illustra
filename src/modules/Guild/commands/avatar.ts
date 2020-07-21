import {MessageEmbed} from "discord.js";
import { ICommandContext } from "../../../types";
import { Command } from "../../../structures/Command";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import { Signs } from "../../../utils/consts";

const options: Partial<Command> = {
    name: "avatar",
    description: "Display a user's avatar.",
    usage: "(user)",
    examples: ["", "Sobriquet"],
    aliases: ["av"],
    userPerms: [],
    botPerms: ["SEND_MESSAGES"]
};

class Avatar extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const member = Illustra.utils.user.resolve(ctx.args[0], ctx.message);

		if (!member){
			ctx.channel.send(`${Signs.ERROR} I could not find a member matching that.`);
			return new CommandResponse("CUSTOM_ERROR", "Member could not be resolved.");
		}
		
		const embed = new MessageEmbed()
			.setTitle("Avatar")
			.setURL(member.user.displayAvatarURL())
			.setColor(ctx.guild?.me?.displayColor || 0x2f3136)
			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			.setImage(member.user.displayAvatarURL({dynamic: true, size: 1024})!);
		
		ctx.channel.send(embed);

		return new CommandResponse();
	}
}

export default Avatar;