import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import GuildModel from "../../models/Guild.js";
import IllustraClient from "../../structures/IllustraClient";

const options: Partial<Command> = {
    name: "prefix",
    description: "Sets or views the guild prefix.",
    module: "Guild",
    usage: "(prefix)",
    examples: ["", "_"],
    aliases: [],
    userPerms: ["MANAGE_GUILD"],
    botPerms: ["SEND_MESSAGES"]
};

class Prefix extends Command{
	constructor(){
		super(options);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(ctx: ICommandContext, Illustra: IllustraClient): Promise<void>{
		let guild = await GuildModel.findOne({id: ctx.guild!.id});
		
		if(!guild){
			ctx.channel.send("Database does not have document reference. Please reinvite me and try again.");
			return;
		}
		
		if(!ctx.args[0]){
			ctx.channel.send(`Your guild's prefix is \`${guild.prefix}\`.`);
			return;
		}	

		if(ctx.args[0].length > 5){
			ctx.channel.send("You must specify a prefix with a max of five characters!");
			return;
		}
		
		guild = await GuildModel.findOneAndUpdate({id: ctx.guild!.id}, {$set: {prefix: ctx.args[0]}}, {new: true});
		
		ctx.channel.send(`\`${ctx.args[0]}\` is now your prefix!`);
	}
}

export default Prefix;