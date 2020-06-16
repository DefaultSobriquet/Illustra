import { Message } from "discord.js";
import { Command } from "../../structures/Command";
import { ICommandContext } from "../../types";
import GuildModel from "../../models/Guild.js";

const options = {
    name: "prefix",
    description: "Sets or resets the guild prefix.",
    module: "Guild",
    usage: "(prefix)",
    examples: ["", "_"],
    aliases: [],
    userPerms: ["MANAGE_GUILD"],
    botPerms: ["SEND_MESSAGES"]
}

class Prefix extends Command{
	constructor(){
		super(options);
	}
	async execute(ctx: ICommandContext, client: any){
		let guild = await GuildModel.findOne({id: ctx.guild!.id});
		
		if(!guild) return ctx.channel.send("Database does not have document reference. Please reinvite me and try again.");
		
		if(!ctx.args[0]) return ctx.channel.send(`Your guild's prefix is \`${guild.prefix}\`.`);		

		if(ctx.args[0].length > 5) return ctx.channel.send("You must specify a prefix with a max of five characters!");
		
		guild = await GuildModel.findOneAndUpdate({id: ctx.guild!.id}, {$set: {prefix: ctx.args[0]}}, {new: true});
		
		ctx.channel.send(`\`${ctx.args[0]}\` is now your prefix!`);
	}
}

export default Prefix;