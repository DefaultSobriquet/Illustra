import {Command} from "../../../structures/Command";
import jimp from "jimp";
import {ICommandContext} from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import {CommandResponse} from "../../../structures/CommandResponse";
import { GuildEmoji } from "discord.js";
import { Signs } from "../../../utils/consts";

const options: Partial<Command> = {
	name: "invert",
	description: "Apply an inversion filter to an emote.",
	usage: "[emote]",
	examples: ["rooThink"],
	aliases: [],
	userPerms: ["MANAGE_EMOJIS"],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
	reqArgs: 1
};

class Invert extends Command{
	
	constructor(){
		super(options);
	}

	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const {props, resolve, validate, embed} = Illustra.utils.emote;
		const emote = validate(ctx.args[0]) ? props(ctx.args[0]) : resolve(ctx.args.join("_"), ctx.guild!);

		if(!emote){
			ctx.channel.send(`${Signs.ERROR} You didn't specify a valid emote!`);
			return new CommandResponse("CUSTOM_ERROR", "User didn't specify a valid emote.");
		}
		
		if(emote.animated){
			ctx.channel.send(`${Signs.ERROR} I can't perform image manipulation on animated emotes!`);
			return new CommandResponse("CUSTOM_ERROR", "User did not specify a static emote.");
		}

		try{
			ctx.channel.startTyping();
			const image = await jimp.read(emote.url!);

			image.invert();

			const processedURI = await image.getBase64Async(jimp.MIME_PNG);

			const processedEmote = await ctx.guild!.emojis.create(processedURI, `INVERT${emote.name.slice(0,26)}`, {
				reason: `${emote.name} inverted by ${ctx.user.tag}`,
				roles: (emote instanceof GuildEmoji) ? emote.roles.cache : []
			});

			ctx.channel.send(embed(processedEmote, ctx.message));

		}catch(err){
			ctx.channel.send(`${Signs.ERROR} There was an unexpected error while processing!`);
			Illustra.logger.error(err);
			return new CommandResponse("UNEXPECTED_ERROR");
		}
		
		ctx.channel.stopTyping();
		
		return new CommandResponse();
	}
	
}

export default Invert;