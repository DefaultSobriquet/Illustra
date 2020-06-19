import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import { Emoji } from "discord.js";

const options: Partial<Command> = {
    name: "rename",
    description: "Rename an existing emote.",
    module: "Emotes",
    usage: "[emote] [name]",
    examples: ["pandaThink rooThink"],
    aliases: [],
    userPerms: ["MANAGE_EMOJIS"],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS"],
	reqArgs: 2
};


class Run extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		const {embed, resolve} = Illustra.utils.emote;
		const emote = resolve(ctx.args[0], ctx.guild!);
		if (!emote){
			ctx.channel.send("I could not find the emote provided.");
			return;
		}
		if (!/^[_a-z0-9]{2,32}$/i.test(ctx.args[1])){
			ctx.channel.send("That is not a valid emote name!");
			return;
		}
		
		emote.setName(ctx.args[1], `Renamed by ${ctx.user.tag}`)
			.then((emote: Emoji) => {
				ctx.channel.send(embed(emote, ctx.message));
			}).catch((err: Error) => {
				console.error(err);
				ctx.channel.send("There was an unexpected error!");
			});
	}
}

export default Run;