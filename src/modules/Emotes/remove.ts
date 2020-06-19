import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import { Emoji } from "discord.js";

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
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		const {embed, resolve} = Illustra.utils.emote;
		const emote = resolve(ctx.args[0], ctx.guild!);
		
		if (!emote){
			ctx.channel.send("Hmm — are you sure that's a valid emote?");
			return;
		}
		
		await ctx.channel.send(embed(emote, ctx.message));
		
		emote.delete(`Removed by ${ctx.user.tag}`)
			.then((emote: Emoji) => ctx.channel.send(`\`🗑️\` | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
			.catch((err: Error) => {
				console.error(err);
				ctx.channel.send("There was a unexpected error (as opposed to the expected ones).");
			});
	}
}

export default Remove;