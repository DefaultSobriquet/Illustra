import {MessageEmbed} from "discord.js";
import { ICommandContext } from "../../types";
import { Command } from "../../structures/Command";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
    name: "avatar",
    description: "Display a user's avatar.",
    module: "Guild",
    usage: "(user)",
    examples: ["", "Sobriquet"],
    aliases: ["av"],
    userPerms: [],
    botPerms: ["SEND_MESSAGES"]
}

class Avatar extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient){
		const member = Illustra.utils.user.resolve(ctx.args[0], ctx.message);
		if (!member) return ctx.channel.send("I could not find a member matching that.");
		
		const embed = new MessageEmbed()
			.setTitle("Avatar")
			.setURL(member.user.displayAvatarURL())
			.setColor(ctx.guild!.me!.displayColor || 0x2f3136)
			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			.setImage(member.user.avatarURL({dynamic: true, size: 1024})!);
		
		ctx.channel.send(embed);
	}
}

export default Avatar;