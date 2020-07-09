import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import { Emoji } from "discord.js";
import { CommandResponse } from "../../structures/CommandResponse";

const options: Partial<Command> = {
    name: "remove",
    description: "Remove an emote from the current guild.",
    module: "Emotes",
    usage: "[emote]",
    examples: ["rooThink"],
    aliases: ["delete", "del"],
    userPerms: ["MANAGE_EMOJIS"],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
	reqArgs: 1
};

class Remove extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const {embed, resolve} = Illustra.utils.emote;
		const emote = resolve(ctx.args[0], ctx.guild!);
		
		if (!emote){
			ctx.channel.send("That's not a valid emote.");
			return new CommandResponse("CUSTOM_ERROR", "User did not provide a valid emote.");
		}
		
		await ctx.channel.send(embed(emote, ctx.message));
		
		emote.delete(`Removed by ${ctx.user.tag}`)
			.then((emote: Emoji) => ctx.channel.send(`\`🗑️\` | [ID \`\`${emote.id}\`\`] — \`${emote.name}\``))
			.catch((err: Error) => {
				Illustra.logger.error(err);
				ctx.channel.send("There was a unexpected error.");
			});

		return new CommandResponse();
	}
}

export default Remove;