import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import { MessageEmbed } from "discord.js";

const options: Partial<Command> = {
    name: "profile",
    description: "Views the specified user's profile.",
    usage: "[user]",
    examples: ["Sobriquet"],
    aliases: [],
    userPerms: [],
    botPerms: ["SEND_MESSAGES"]
};

class Rep extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{

		const target = Illustra.utils.user.resolve(ctx.args[0], ctx.message);

		if(!target){
			ctx.channel.send("I couldn't find that user!");
			return new CommandResponse("CUSTOM_ERROR", "User couldn't be found.");
		}

		const {count, lastRecieved} = await Illustra.managers.user.getRep(target.id);
		const {nickname, bio, colour} = await Illustra.managers.user.getProfile(target.id);
	
		const embed = new MessageEmbed()
			.setTitle(`${nickname ?? target.user.username}'s Profile`)
			.setDescription(`About: ${bio}`)
			.setColor(colour ?? (target.displayColor || 0x2f3136))
			.addField("Reputation", `${count} Points`);

		if(lastRecieved?.emote && lastRecieved?.timestamp){
			const emoteDoc = (await Illustra.managers.emote.model.findById(lastRecieved.emote))!;
			embed.setTimestamp(lastRecieved.timestamp)
				.setFooter("Reputation Emote", `https://cdn.discordapp.com/emojis/${emoteDoc.id}.${emoteDoc.animated ? "gif" : "png"}?v=1`);
		}

		ctx.channel.send(embed);

		return new CommandResponse();
	}
}

export default Rep;