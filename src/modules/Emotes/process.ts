import { Command } from "../../structures/Command";
import jimp from "jimp";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import { CommandResponse } from "../../structures/CommandResponse";
import { GuildEmoji } from "discord.js";
import { Flag } from "../../structures/Flag";

const options: Partial<Command> = {
	name: "process",
	description: "Apply image manipulation to a specified static emote using flags.",
	module: "Emotes",
	usage: "[emote] [...flags]",
	examples: ["rooThink --invert --fliph"],
	aliases: ["modify"],
	userPerms: ["MANAGE_EMOJIS"],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
	reqArgs: 1
};

class Process extends Command{
	
	constructor(){
		super(options);
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
			
			image.flip("fliph" in ctx.flags, "flipv" in ctx.flags);
			if("grey" in ctx.flags) image.greyscale();
			if("blur" in ctx.flags) image.blur(parseInt(ctx.flags["blur"],10) ?? 1);
			if("invert" in ctx.flags) image.invert();
			if("pixelate" in ctx.flags) image.pixelate(parseInt(ctx.flags["pixelate"],10) ?? 1);
			const processedURI = await image.getBase64Async(jimp.MIME_PNG);

			const processedEmote = await ctx.guild!.emojis.create(processedURI, `P${emote.name.slice(0,31)}`, {
				reason: `${emote.name} processed by ${ctx.user.tag}`,
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

export const flags = [
	new Flag({
		name: "fliph",
		description: "Flips the emote horizontally.",
		hasValue: false
	}),
	new Flag({
		name: "flipv",
		description: "Flips the emote vertically.",
		hasValue: false
	}),
	new Flag({
		name: "grey", 
		description: "Applies greyscale to the emote.",
		hasValue: true
	}),
	new Flag({
		name: "blur",
		description: "Applies a blur to the emote.",
		hasValue: true
	}),
	new Flag({
		name: "invert",
		description: "Inverts the color of the emote.",
		hasValue: false
	}),
	new Flag({
		name: "pixelate",
		description: "Pixelates the emote.",
		hasValue: true
	})
];

export default Process;