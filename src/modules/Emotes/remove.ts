import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import { remove } from "lodash";

const options: Partial<Command> = {
    name: "remove",
    description: "Remove an emote from the current guild.",
    module: "Emotes",
    usage: "[emote]",
    examples: ["rooThink"],
    aliases: ["delete", "del"],
    userPerms: ["MANAGE_EMOJIS"],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
};

class Remove extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient){
		const {embed, resolve} = Illustra.utils.emote;
		const emote = resolve(ctx.args[0], ctx.guild!);
		
		if (!emote) return ctx.channel.send("Please enter a valid emote.");
		
		await ctx.channel.send(embed(emote, ctx.message));
		
		emote.delete(`Removed by ${ctx.user.tag}`)
			.then((emote: any) => ctx.channel.send(`\`🗑️\` | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
			.catch((err: Error) => {
				console.error(err);
				ctx.channel.send("There was a unexpected error.");
			});
	}
}

export default Remove;