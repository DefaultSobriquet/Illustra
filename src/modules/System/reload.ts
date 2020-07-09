import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";
import { CommandResponse } from "../../structures/CommandResponse";

const options: Partial<Command> = {
	name: "reload",
	description: "Reloads a bot command.",
	module: "System",
	usage: "[command]",
	examples: ["ping"],
	aliases: [],
	userPerms: [],
	botPerms: ["SEND_MESSAGES"],
	devOnly: true,
	reqArgs: 1
};

class Reload extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<CommandResponse>{
		
		const commandName = ctx.args[0];
		
		if (!Illustra.commands.has(commandName)){
			ctx.channel.send("That command does not exist!");
			return new CommandResponse();
		}
		
		const commandModule = Illustra.commands.get(commandName)!.module;
		
		delete require.cache[require.resolve(`../${commandModule}/${commandName}.js`)];
		
		Illustra.commands.delete(commandName);
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const cmd = require(`../${commandModule}/${commandName}.js`).default;
		const props = new cmd();
		Illustra.commands.set(commandName, props);
		
		ctx.channel.send(`The command ${commandName} has been reloaded!.`);
		return new CommandResponse();
	}
}

export default Reload;