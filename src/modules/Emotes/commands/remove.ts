import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { Emoji, GuildEmoji } from "discord.js";
import { CommandResponse } from "../../../structures/CommandResponse";
import { Signs } from "../../../utils/consts";

const options: Partial<Command> = {
    name: "remove",
    description: "Remove emotes (up to five) from the current guild.",
    usage: "[...emote]",
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
		const emotes: GuildEmoji[] = [];
		
		ctx.args.forEach(arg => {
			const emote = resolve(arg, ctx.guild!);
			if(emote) emotes.push(emote);
		});

		if (!emotes.length){
			ctx.channel.send(`${Signs.ERROR} You didn't provide any valid emotes!`);
			return new CommandResponse("CUSTOM_ERROR", "User did not provide a valid emote.");
		}
		
		if(emotes.length > 5){
			ctx.channel.send(`${Signs.ERROR} You're removing too many emotes at once! Specify a maximum of five.`);
			return new CommandResponse("CUSTOM_ERROR", "User provided too many emotes.");
		}

		if(emotes.length === 1) await ctx.channel.send(embed(emotes[0], ctx.message));

		emotes.forEach((emote) => {
			emote.delete(`Removed by ${ctx.user.tag}`)
				.then((emote: Emoji) => ctx.channel.send(`\`🗑️\` | [ID \`\`${emote.id}\`\`] — \`${emote.name}\``))
				.catch((err: Error) => {
					Illustra.logger.error(err);
					ctx.channel.send(`There was a unexpected error removing ${emote}.`);
				});
		});

		return new CommandResponse();
	}
}

export default Remove;