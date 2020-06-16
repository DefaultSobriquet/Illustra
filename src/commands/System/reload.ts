import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";

const options = {
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
	async execute(ctx: ICommandContext, client: any){
		if (!client.config.trusted.includes(ctx.user.id)) return;
		if (!ctx.args || ctx.args.length < 1) return ctx.channel.send("You must provide a command name to reload.");
		
		const commandName = ctx.args[0];
		
		if (!client.commands.has(commandName)) return ctx.channel.send("That command does not exist!");
	
		const commandModule = client.commands.get(commandName).module;
		
		delete require.cache[require.resolve(`../${commandModule}/${commandName}.js`)];
		
		client.commands.delete(commandName);
		const props = require(`../${commandModule}/${commandName}.js`);
		client.commands.set(commandName, props);
		
		ctx.channel.send(`The command ${commandName} has been reloaded!`);
	}
}

export default Reload;