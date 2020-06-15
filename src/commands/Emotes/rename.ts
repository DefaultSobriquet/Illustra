import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
    name: "rename",
    description: "Rename an existing emote.",
    module: "Emotes",
    usage: "[emote] [name]",
    examples: ["pandaThink rooThink"],
    aliases: [],
    userPerms: ["MANAGE_EMOJIS"],
    botPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS"]
}


class Run extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		const {embed, resolve} = client.utils.emotes;
		const emote = resolve(ctx.args[0], ctx.message);
		if (!emote) return ctx.channel.send("I could not find the emote provided.");
		if (!/^[_a-z0-9]{2,32}$/i.test(ctx.args[1])) return ctx.channel.send("That is not a valid emote name!");
		
		emote.setName(ctx.args[1], `Renamed by ${ctx.user.tag}`)
			.then((emote: any) => {
				ctx.channel.send(embed(emote, ctx.message));
			}).catch((err: Error) => {
				console.log(err);
				ctx.channel.send("There was an unexpected error!");
			});
	}
}

export default Run;