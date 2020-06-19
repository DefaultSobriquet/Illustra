import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
	name: "ping",
	description: "Check the bot and Discord's API latency.",
	module: "Information",
	usage: "",
	examples: [""],
	aliases: ["latency", "pong"],
	userPerms: [],
	botPerms: ["SEND_MESSAGES"]
};

class Ping extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		const msg = await ctx.channel.send("Pong!");
		msg.edit(`Pong! \`${msg.createdTimestamp - ctx.message.createdTimestamp}ms\``);
	}
}

export default Ping;