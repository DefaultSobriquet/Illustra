import {Command} from "../../../structures/Command";
import {ICommandContext} from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import axios from "axios";
import gm from "gm";
import {promisify} from "util";
import { CommandResponse } from "../../../structures/CommandResponse";

// Hack declaration for extending the prototype
declare module "gm" {
	interface State{
		identifyPromise(this: State): Promise<State>;
	}
}

gm.prototype.identifyPromise = promisify(gm.prototype.identify);

const options: Partial<Command> = {
	name: "slow",
	description: "Slow an animated emote with a delay multiplier.",
	usage: "[emote] (multiplier)",
	examples: ["toothless", "toothless 3"],
	aliases: ["emoji"],
	userPerms: ["MANAGE_EMOJIS"],
	botPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
	reqArgs: 1
};

class Slow extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		const {props, resolve, validate, embed} = Illustra.utils.emote;
		const emote = validate(ctx.args[0]) ? props(ctx.args[0]) : resolve(ctx.args.join("_"), ctx.guild!);
	
		if (!emote){
			ctx.channel.send("That emote doesn't exist.");
			return new CommandResponse("CUSTOM_ERROR", "No valid emote was provided.");
		}

		if(!emote.animated){
			ctx.channel.send("Please give me an animated emote.");
			return new CommandResponse("CUSTOM_ERROR", "An animated emote was not provided.");
		}

		ctx.channel.startTyping();

		const response = (await axios({
			method: "get",
			url: `${emote.url!}?v=1`,
			responseType: "arraybuffer"
		})).data;
		
		const dataBuffer = Buffer.from(response); // Ensure that gm only gets a Buffer argument
		
		const image = gm(dataBuffer);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any = await image.identifyPromise();

		if(!data.Delay){
			ctx.channel.send("I can't read this animated emote's data!");
			return new CommandResponse("CUSTOM_ERROR", "Animated emote data could not be read.");
		}

		const delay = data.Delay[0].split("x");

		const multiplier = ctx.args[1] ? parseInt(ctx.args[1],10) : 2;

		image.delay(parseInt(`${parseInt(delay[0]) * multiplier}x${delay[1]}`))
			.toBuffer("gif", async (err, buffer) => {
				if(err){
					Illustra.logger.error(err);
					ctx.channel.send("There was an unexpected error!");
					return;
				}
				ctx.guild!.emojis.create(buffer, `SLOW${emote.name.slice(0,28)}`)
					.then(e => {
						ctx.channel.send(embed(e, ctx.message));
					}).catch(err => {
						ctx.channel.send("There was an unexpected error!");
						Illustra.logger.error(err);
					});
			});

		ctx.channel.stopTyping();

		return new CommandResponse();

	}
}

export default Slow;