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

	end(Illustra: IllustraClient): void{
		Illustra.client.destroy();
		process.exit(0);
	}

	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{

		const time = ms(ctx.args[0] ?? "0");

		if (time) {
			await ctx.channel.send(`I'll restart at ${new Date(Date.now()+time).toLocaleString()}.`);
			Illustra.client.setTimeout(this.end, time, Illustra);
			return new CommandResponse();
		}
		
		await ctx.channel.send("I'll restart now.");

		this.end(Illustra);

		return new CommandResponse();
	}
}

export default Restart;