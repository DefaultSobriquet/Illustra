import {Command} from "../../structures/Command";
import jimp from "jimp";
import {ICommandContext} from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import {CommandResponse} from "../../structures/CommandResponse";
import { GuildEmoji } from "discord.js";

const options: Partial<Command> = {
	name: "flip",
	description: "Flips the specified emote vertically or horizontally.",
	module: "Emotes",
	usage: "[vertical|horizontal] [emote]",
	examples: ["vertical rooThink", "horizontal rooThink"],
	aliases: [],
	userPerms: ["MANAGE_EMOJIS"],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
	reqArgs: 1,
	enabled: false
};

class Flip extends Command{
	
	constructor(){
		super(options);
	}

	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		ctx.channel.send("Please specify either a vertical or horizontal flip!");
		return new CommandResponse();
	}
	
}

class Vertical extends Flip{
	
}

export default Flip;