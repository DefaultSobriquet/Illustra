import {Command} from "../../structures/Command";
import {ICommandContext} from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import {CommandResponse} from "../../structures/CommandResponse";
import { GuildEmoji } from "discord.js";
import jimp from "jimp";

class Flip extends Command{
	
	constructor(options: Partial<Command>){
		super(options ?? {
			name: "flip",
			description: "Flips the specified emote vertically or horizontally.",
			module: "Emotes",
			usage: "[vertical|horizontal] [emote]",
			examples: ["vertical rooThink", "horizontal rooThink"],
			aliases: [],
			userPerms: ["MANAGE_EMOJIS"],
			botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		ctx.channel.send("Please specify either a vertical or horizontal flip!");
		return new CommandResponse();
	}
	
}

class Vertical extends Flip{
	constructor(){
		super({
			name: "vertical",
			description: "Flips the specified emote vertically.",
			module: "Emotes",
			usage: "[emote]",
			examples: ["rooThink"],
			aliases: ["v"],
			userPerms: ["MANAGE_EMOJIS"],
			botPerms: ["SEND_MESSAGES"],
			reqArgs: 1
		});
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const {props, resolve, validate, embed} = Illustra.utils.emote;
		const emote = validate(ctx.args[0]) ? props(ctx.args[0]) : resolve(ctx.args.join("_"), ctx.guild!);

		if(!emote){
			ctx.channel.send("You didn't specify a valid emote!");
			return new CommandResponse("CUSTOM_ERROR", "User didn't specify a valid emote.");
		}
		
		if(emote.animated){
			ctx.channel.send("I can't perform image manipulation on animated emotes!");
			return new CommandResponse("CUSTOM_ERROR", "User did not specify a static emote.");
		}

		try{
			ctx.channel.startTyping();
			const image = await jimp.read(emote.url!);

			image.flip(false, true);

			const processedURI = await image.getBase64Async(jimp.MIME_PNG);

			const processedEmote = await ctx.guild!.emojis.create(processedURI, `FLIP${emote.name.slice(0,28)}`, {
				reason: `${emote.name} flipped by ${ctx.user.tag}`,
				roles: (emote instanceof GuildEmoji) ? emote.roles.cache : []
			});

			ctx.channel.send(embed(processedEmote, ctx.message));

		}catch(err){
			ctx.channel.send("There was an unexpected error while processing!");
			Illustra.logger.error(err);
			return new CommandResponse("UNEXPECTED_ERROR");
		}
		
		ctx.channel.stopTyping();
		
		return new CommandResponse();
	}
}

class Horizontal extends Flip{
	constructor(){
		super({
			name: "horizontal",
			description: "Flips the specified emote horizontally.",
			module: "Emotes",
			usage: "[emote]",
			examples: ["rooThink"],
			aliases: ["h"],
			userPerms: ["MANAGE_EMOJIS"],
			botPerms: ["SEND_MESSAGES"],
			reqArgs: 1
		});
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const {props, resolve, validate, embed} = Illustra.utils.emote;
		const emote = validate(ctx.args[0]) ? props(ctx.args[0]) : resolve(ctx.args.join("_"), ctx.guild!);

		if(!emote){
			ctx.channel.send("You didn't specify a valid emote!");
			return new CommandResponse("CUSTOM_ERROR", "User didn't specify a valid emote.");
		}
		
		if(emote.animated){
			ctx.channel.send("I can't perform image manipulation on animated emotes!");
			return new CommandResponse("CUSTOM_ERROR", "User did not specify a static emote.");
		}

		try{
			ctx.channel.startTyping();
			const image = await jimp.read(emote.url!);

			image.flip(true, false);

			const processedURI = await image.getBase64Async(jimp.MIME_PNG);

			const processedEmote = await ctx.guild!.emojis.create(processedURI, `FLIP${emote.name.slice(0,28)}`, {
				reason: `${emote.name} flipped by ${ctx.user.tag}`,
				roles: (emote instanceof GuildEmoji) ? emote.roles.cache : []
			});

			ctx.channel.send(embed(processedEmote, ctx.message));

		}catch(err){
			ctx.channel.send("There was an unexpected error while processing!");
			Illustra.logger.error(err);
			return new CommandResponse("UNEXPECTED_ERROR");
		}
		
		ctx.channel.stopTyping();
		
		return new CommandResponse();
	}
}

export const subcommands = [new Vertical(), new Horizontal()];
export default Flip;