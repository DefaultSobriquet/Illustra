import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
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
	async execute(ctx: ICommandContext, client: any){
		const msg = await ctx.channel.send("Pong!");
		msg.edit(`Pong! \`${msg.createdTimestamp - ctx.message.createdTimestamp}ms\``);
	}
}

export default Ping;