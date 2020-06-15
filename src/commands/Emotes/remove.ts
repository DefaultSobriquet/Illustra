import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
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
	async execute(ctx: ICommandContext, client: any){
		const {embed, resolve} = client.utils.emotes;
		const emote = resolve(ctx.args[0], ctx.message);
		
		if (!emote) return ctx.channel.send("Please enter a valid emote.");
		
		await ctx.channel.send(embed(emote, ctx.message));
		
		emote.delete(`Removed by ${ctx.user.tag}`)
			.then((emote: any) => ctx.channel.send(`\`🗑️\` | [ID \`\`${emote.id}\`\`] — \`\`${emote.name}\`\``))
			.catch((err: any) => {
				console.log(err);
				ctx.channel.send("There was a unexpected error.");
			});
	}
}