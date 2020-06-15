import {Command} from "../../structures/Command";
import {ICommandContext} from "../../types";

const options = {
	name: "emote",
	description: "Get information about an emote.",
	module: "Emotes",
	usage: "[emote]",
	examples: ["rooThink"],
	aliases: ["emoji"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"]
}

class Emote extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const {props, embed, resolve} = client.utils.emotes;
		const emote = /<?(a:)?(\w{2,32}):(\d{17,19})>?/.test(ctx.args[0]) ? props(ctx.args[0]) : resolve(ctx.args.join("_"), ctx.message);
		if (!emote) return ctx.channel.send("Please enter a valid emote.");
		ctx.channel.send(embed(emote, ctx.message));
	}
}

export default Emote;