import ms from "ms";
import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";

const options: Partial<Command> = {
	name: "restart",
	description: "Restart the bot.",
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
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		
		const end = () => {
			Illustra.client.destroy();
			process.exit(0);
		};

		if (ctx.args[0] && !isNaN(ms(ctx.args[0]))) {
			await ctx.channel.send(`I'll restart at ${new Date(Date.now()+ms(ctx.args[0])).toLocaleString()}.`);
			Illustra.client.setTimeout(end, ms(ctx.args[0]), Illustra);
			return new CommandResponse();
		}
		
		await ctx.channel.send("I'll restart now.");
		end();

		return new CommandResponse();
	}
}

export default Restart;