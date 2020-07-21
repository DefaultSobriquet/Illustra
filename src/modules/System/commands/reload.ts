import { Command } from "../../../structures/Command";
import { ICommandContext } from "../../../types";
import IllustraClient from "../../../structures/IllustraClient";
import { CommandResponse } from "../../../structures/CommandResponse";
import { Signs } from "../../../utils/consts";

const options: Partial<Command> = {
	name: "reload",
	description: "Reloads a bot command.",
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
		
		const command = Illustra.handler.findCommand(ctx.args[0]);
		
		if (!command){
			ctx.channel.send(`${Signs.ERROR} That command does not exist!`);
			return new CommandResponse("CUSTOM_ERROR", "An invalid command name was provided.");
		}
		
		delete require.cache[require.resolve(`../${command.module}/${command.name}.js`)];
		
		Illustra.commands.delete(command.name);
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const cmd = require(`../${command.module}/${command.name}.js`).default;
		const props = new cmd();
		Illustra.commands.set(command.name, props);
		
		ctx.channel.send(`${Signs.SUCCESS} The command ${command.name} has been reloaded!`);
		return new CommandResponse();
	}
}

export default Reload;