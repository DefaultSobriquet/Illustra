import ms from "ms";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
	name: "restart",
	description: "Restart the bot.",
	module: "System",
	usage: "(time)",
	examples: ["", "1m"],
	aliases: [],
	userPerms: [],
	botPerms: ["SEND_MESSAGES"],
	devOnly: true
};

class Restart extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		
		const end = () => {
			Illustra.client.destroy();
			process.exit(0);
		};

		if (ctx.args[0] && !isNaN(ms(ctx.args[0]))) {
			await ctx.channel.send(`I'll be restarting at ${new Date(Date.now()+ms(ctx.args[0])).toLocaleString()}, if that's alright with you.`);
			Illustra.client.setTimeout(end, ms(ctx.args[0]), Illustra);
			return;
		}
		
		await ctx.channel.send("I'll be restarting now, if that's alright with you.");
		end();
	}
}

export default Restart;