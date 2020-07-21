import {Command} from "../../../structures/Command";
import {ICommandContext} from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import {CommandResponse} from "../../../structures/CommandResponse";
import { Signs } from "../../../utils/consts";

const options: Partial<Command> = {
	name: "emote",
	description: "Get information about an emote.",
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

	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const {props, embed, resolve, validate} = Illustra.utils.emote;
		const emote = validate(ctx.args[0]) ? props(ctx.args[0]) : resolve(ctx.args.join("_"), ctx.guild!);

		if(!emote){
			ctx.channel.send(`${Signs.ERROR} You didn't specify a valid emote!`);
			return new CommandResponse("CUSTOM_ERROR", "User didn't specify a valid emote.");
		}
		
		ctx.channel.send(embed(emote, ctx.message));
		
		return new CommandResponse();
	}
	
}

export default Emote;