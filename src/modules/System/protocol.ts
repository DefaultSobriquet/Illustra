import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import ms from "ms";
import { CommandResponse } from "../../structures/CommandResponse";

class Protocol extends Command{
	constructor(options?: Partial<Command>){
		super(options ?? {
			name: "protocol",
			description: "Activates a protocol.",
			module: "System",
			usage: "[protocol]",
			examples: ["leave"],
			aliases: ["p"],
			userPerms: [],
			botPerms: ["SEND_MESSAGES"],
			devOnly: true,
			reqArgs: 0
		});
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		ctx.channel.send("No protocol detected.");
		return new CommandResponse();
	}
}

class Leave extends Protocol{
	constructor(){
		super({
			name: "leave",
			description: "Leaves the current guild, or a specified guild.",
			module: "System",
			usage: "(guild ID)",
			examples: ["659158367323029552"],
			aliases: ["l"],
			userPerms: [],
			botPerms: [],
			devOnly: true,
			reqArgs: 0
		});
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		ctx.guild!.leave();
		return new CommandResponse();
	}
}

class Ghost extends Protocol{
	constructor(){
		super({
			name: "ghost",
			description: "Sends the bot offline.",
			module: "System",
			usage: "(time)",
			examples: ["1m"],
			aliases: ["g"],
			userPerms: [],
			botPerms: [],
			devOnly: true,
			reqArgs: 0
		});
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		if(Illustra.client.user!.presence.status === "invisible"){
			Illustra.client.user!.setStatus("online");
			return new CommandResponse();
		}
		Illustra.client.user!.setStatus("invisible");
		if(ctx.args[0] && !isNaN(ms(ctx.args[0]))){
			Illustra.client.setTimeout(() => {
				Illustra.client.user!.setStatus("online");
			}, ms(ctx.args[0]), Illustra);
		}
		return new CommandResponse();
	}	
}

export default Protocol;
export const subcommands = [new Leave(), new Ghost()];