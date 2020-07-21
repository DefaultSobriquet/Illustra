import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import { Signs } from "../../../utils/consts";

const options: Partial<Command> = {
    name: "rename",
    description: "Rename an existing emote.",
    usage: "[emote] [name]",
    examples: ["pandaThink rooThink"],
    aliases: [],
    userPerms: ["MANAGE_EMOJIS"],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS"],
	reqArgs: 2
};


class Rename extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const {embed, resolve} = Illustra.utils.emote;
		const emote = resolve(ctx.args[0], ctx.guild!);

		if (!emote){
			ctx.channel.send(`${Signs.ERROR} That's not a vaild emote.`);
			return new CommandResponse("CUSTOM_ERROR", "User did not provide a valid emote.");
		}
		if (!/^[_a-z0-9]{2,32}$/i.test(ctx.args[1])){
			ctx.channel.send(`${Signs.ERROR} That's not a valid emote name.`);
			return new CommandResponse("CUSTOM_ERROR", "User did not provide a valid emote name.");
		}
		
		emote.setName(ctx.args[1], `Renamed by ${ctx.user.tag}`)
			.then((emote) => {
				ctx.channel.send(embed(emote, ctx.message));
			}).catch((err) => {
				Illustra.logger.error(err);
				ctx.channel.send(`${Signs.ERROR} There was an unexpected error.`);
			});

		return new CommandResponse();
	}
}

export default Rename;