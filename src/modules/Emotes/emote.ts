import {Command} from "../../structures/Command";
import {ICommandContext} from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
	name: "emote",
	description: "Get information about an emote.",
	module: "Emotes",
	usage: "[emote]",
	examples: ["rooThink"],
	aliases: ["emoji"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
	reqArgs: 1
};

class Emote extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		const {props, embed, resolve, validate} = Illustra.utils.emote;
		const emote = validate(ctx.args[0]) ? props(ctx.args[0]) : resolve(ctx.args.join("_"), ctx.guild!);
		if (!emote){
			ctx.channel.send("Please enter a valid emote.");
			return;
		}
		ctx.channel.send(embed(emote, ctx.message));
	}
}

export default Emote;