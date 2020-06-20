import {Command} from "../../structures/Command";
import {ICommandContext} from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import axios from "axios";
import gm from "gm";
import {promisify} from "util";

// Hack declaration for extending the prototype
declare module "gm" {
	interface State{
		identifyPromise(this: State): Promise<State>;
	}
}

gm.prototype.identifyPromise = promisify(gm.prototype.identify);

const options: Partial<Command> = {
	name: "slow",
	description: "Slow an animated emote.",
	module: "Emotes",
	usage: "[emote]",
	examples: ["toothless"],
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
		const {props, resolve, validate, embed} = Illustra.utils.emote;
		const emote = validate(ctx.args[0]) ? props(ctx.args[0]) : resolve(ctx.args.join("_"), ctx.guild!);
	
		if (!emote){
			ctx.channel.send("I — don't think that emote exists.");
			return;
		}

		if(!emote.animated){
			ctx.channel.send("I can't really slow a static emote, can I?");
			return;
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

		if(data.Delay) console.log(data.Delay, data.Delay[0].split("x"));

		const delay = data.Delay ? data.Delay[0].split("x") : [0, 100];

		image.delay(parseInt(`${parseInt(delay[0]) * 2}x${delay[1]}`)).toBuffer("gif", async (err, buffer) => {
			if(err) return console.error(err);
			ctx.guild!.emojis.create(buffer, `SLOW${emote.name.slice(0,28)}`)
				.then(e => {
					ctx.channel.send(embed(e, ctx.message));
				}).catch(err => {
					ctx.channel.send("Oh. Err, something went wrong — sorry about that. I'll look into it.");
					console.log(err);
				});
			
		});

		ctx.channel.stopTyping();

	}
}

export default Emote;