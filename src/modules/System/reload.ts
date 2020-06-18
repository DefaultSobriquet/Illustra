import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
	name: "reload",
	description: "Reloads a bot command.",
	module: "System",
	usage: "[command]",
	examples: ["ping"],
	aliases: [],
	userPerms: [],
	botPerms: ["SEND_MESSAGES"],
	devOnly: true
}

class Reload extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, Illustra: IllustraClient){
		if (!Illustra.config.trusted.includes(ctx.user.id)) return;
		if (!ctx.args || ctx.args.length < 1) return ctx.channel.send("You must provide a command name to reload.");
		
		const commandName = ctx.args[0];
		
		if (!Illustra.commands.has(commandName)) return ctx.channel.send("That command does not exist!");
	
		//@ts-ignore This shouldn't have an error; we already verify that the command does in fact exist (see above).
		const commandModule = Illustra.commands.get(commandName).module;
		
		delete require.cache[require.resolve(`../${commandModule}/${commandName}.js`)];
		
		Illustra.commands.delete(commandName);
		const cmd = require(`../${commandModule}/${commandName}.js`).default;
		const props = new cmd();
		Illustra.commands.set(commandName, props);
		
		ctx.channel.send(`The command ${commandName} has been reloaded!`);
	}
}

export default Reload;